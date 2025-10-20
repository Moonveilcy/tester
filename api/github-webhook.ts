import { Webhooks, createNodeMiddleware } from "@octokit/webhooks";
import { Octokit } from "@octokit/rest";
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

export const config = {
  runtime: 'edge',
};

const app = new Hono().basePath('/api')

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
  const owner = repository.owner.login;
  const repo = repository.name;
  const prNumber = pull_request.number;
  const installationId = installation?.id;

  if (!installationId) {
      console.error("Installation ID not found.");
      return;
  }
  
  const octokit = new Octokit({ auth: `token ${process.env.GITHUB_APP_TOKEN}` });

  try {
    const compare = await octokit.repos.compareCommits({
      owner,
      repo,
      base: pull_request.base.sha,
      head: pull_request.head.sha,
    });

    const diff = compare.data.files?.map(file => file.patch).join('\n') || "";
    const reviewComment = await analyzeCodeWithGemini(diff);

    await octokit.issues.createComment({
      owner,
      repo,
      issue_number: prNumber,
      body: `**GitMoon AI Review** 🌙\n\n---\n\n${reviewComment}`,
    });
  } catch (error) {
      console.error("Error processing PR:", error);
  }
});


app.post('/github-webhook', async (c) => {
    const headers = {
        "x-github-event": c.req.header('x-github-event') || "",
        "x-hub-signature-256": c.req.header('x-hub-signature-256') || "",
        "x-github-delivery": c.req.header('x-github-delivery') || "",
    };
    await webhooks.verifyAndReceive({
        id: headers['x-github-delivery'],
        name: headers['x-github-event'] as any,
        signature: headers['x-hub-signature-256'],
        payload: await c.req.text(),
    });
    return c.json({ message: 'Webhook received!' });
})

export default handle(app)