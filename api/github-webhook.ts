import { Webhooks } from "@octokit/webhooks";
import { Octokit } from "@octokit/rest";

export const config = {
  runtime: 'edge',
};

const webhooks = new Webhooks({
  secret: process.env.GITHUB_WEBHOOK_SECRET!,
});

async function analyzeCodeWithGemini(diff: string) {
    if (!diff) return "No changes detected.";

    const prompt = `
        You are an expert code reviewer.
        Analyze the following code changes (in diff format) and provide a concise, constructive review.
        Focus on potential bugs, code style improvements, and best practices.
        If there are no issues, just say "Looks good to me!".

        Code Diff:
        \`\`\`diff
        ${diff}
        \`\`\`
    `;

    const geminiKey = process.env.VITE_GEMINI_API_KEY;
    if (!geminiKey) return "Gemini API Key is not configured.";

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${geminiKey}`;
    
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        });
        const result = await response.json();
        return result.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return "Sorry, I couldn't analyze the code at this moment.";
    }
}

webhooks.on("pull_request.opened", async ({ payload }) => {
  const { repository, pull_request, installation } = payload;
  
  if (!installation) {
      console.error("Installation object is missing.");
      return;
  }

  const octokit = new Octokit({ auth: `token ${process.env.GITHUB_APP_TOKEN}` });

  try {
    const compare = await octokit.repos.compareCommits({
      owner: repository.owner.login,
      repo: repository.name,
      base: pull_request.base.sha,
      head: pull_request.head.sha,
    });

    const diff = compare.data.files?.map(file => file.patch ?? '').join('\n') || "";
    const reviewComment = await analyzeCodeWithGemini(diff);

    await octokit.issues.createComment({
      owner: repository.owner.login,
      repo: repository.name,
      issue_number: pull_request.number,
      body: `**GitMoon AI Review** 🌙\n\n---\n\n${reviewComment}`,
    });
  } catch (error) {
      console.error("Error processing PR:", error);
  }
});

export default async function handler(request: Request) {
    if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        await webhooks.verifyAndReceive({
            id: request.headers.get('x-github-delivery')!,
            name: request.headers.get('x-github-event') as any,
            signature: request.headers.get('x-hub-signature-256')!,
            payload: await request.text(),
        });

        return new Response(JSON.stringify({ message: 'Webhook received!' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        console.error("Webhook Error:", error.message);
        return new Response(JSON.stringify({ error: 'Webhook processing failed' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}