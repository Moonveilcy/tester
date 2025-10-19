import React from 'react';

const reviews = [
    {
        name: 'Devina R.',
        handle: '@devina_ux',
        avatar: 'https://placehold.co/100x100/f472b6/111827?text=DR',
        body: 'GitMoon is a lifesaver! The README generator saved me hours of tedious work. The UI is clean and super intuitive.',
        color: 'bg-pink-300'
    },
    {
        name: 'Bagas P.',
        handle: '@bagas_codes',
        avatar: 'https://placehold.co/100x100/f97316/111827?text=BP',
        body: 'As a mobile-first developer, this is the tool I\'ve been waiting for. Committing directly from my phone is a game-changer.',
        color: 'bg-orange-300'
    },
    {
        name: 'Citra A.',
        handle: '@citra_frontend',
        avatar: 'https://placehold.co/100x100/facc15/111827?text=CA',
        body: 'The client-side approach to security is brilliant. I feel safe using my tokens knowing they never leave my device.',
        color: 'bg-yellow-300'
    },
    {
        name: 'Rian F.',
        handle: '@rian_fullstack',
        avatar: 'https://placehold.co/100x100/a78bfa/111827?text=RF',
        body: 'I was skeptical at first, but the commit and push feature is surprisingly fast and reliable. Highly recommended!',
        color: 'bg-purple-300'
    },
    {
        name: 'Sari W.',
        handle: '@sari_designs',
        avatar: 'https://placehold.co/100x100/22d3ee/111827?text=SW',
        body: 'The UI is just beautiful. The colorful cards and smooth animations make managing repos actually enjoyable.',
        color: 'bg-cyan-300'
    }
];

const ReviewCard = ({ review }) => (
    <div className={`w-[350px] flex-shrink-0 mx-4 p-6 rounded-lg text-black border-b-4 border-r-4 border-black ${review.color}`}>
        <div className="flex items-center mb-4">
            <img src={review.avatar} alt={review.name} className="w-14 h-14 rounded-full border-2 border-black" />
            <div className="ml-4">
                <p className="font-bold text-lg">{review.name}</p>
                <p className="text-sm text-black/60">{review.handle}</p>
            </div>
        </div>
        <p className="text-black/80 leading-relaxed">{review.body}</p>
    </div>
);

const Marquee = ({ reviews, direction = 'left' }) => (
    <div className="relative flex overflow-x-hidden">
        <div className={`py-8 flex whitespace-nowrap ${direction === 'left' ? 'animate-marquee-ltr' : 'animate-marquee-rtl'}`}>
            {[...reviews, ...reviews].map((review, index) => (
                <ReviewCard key={`marquee-${index}`} review={review} />
            ))}
        </div>
    </div>
);


export default function Reviews() {
    return (
        <>
            <style>
                {`
                @keyframes marquee-ltr {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes marquee-rtl {
                    0% { transform: translateX(-50%); }
                    100% { transform: translateX(0%); }
                }
                .animate-marquee-ltr {
                    animation: marquee-ltr 40s linear infinite;
                }
                .animate-marquee-rtl {
                    animation: marquee-rtl 40s linear infinite;
                }
                `}
            </style>
            <section id="reviews" className="bg-white text-black py-16 lg:py-24">
                <div className="container mx-auto px-6 max-w-6xl text-center">
                     <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-800">
                        Loved by Developers
                    </h2>
                    <p className="text-lg lg:text-xl text-gray-600 max-w-3xl leading-relaxed mx-auto">
                        See what developers are saying about their experience with GitMoon.
                    </p>
                </div>
                <div className="mt-12 md:hidden">
                    <div className="container mx-auto px-6 space-y-8">
                        {reviews.map((review, index) => (
                             <ReviewCard key={`static-${index}`} review={review} />
                        ))}
                    </div>
                </div>
                <div className="hidden md:block mt-8">
                    <Marquee reviews={reviews} direction="left" />
                    <Marquee reviews={[...reviews].reverse()} direction="right" />
                </div>
            </section>
        </>
    );
}