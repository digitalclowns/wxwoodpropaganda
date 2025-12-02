document.addEventListener('DOMContentLoaded', () => {
    const scroller = scrollama();
    const stepsContainer = document.getElementById('steps-container');
    const visualContainer = document.getElementById('visual-container');
    const visualContent = document.getElementById('visual-content');

    // Fetch content
    fetch('content.json')
        .then(response => response.json())
        .then(data => {
            renderSteps(data);
            initScrollama();
        })
        .catch(err => console.error('Error loading content:', err));

    function renderSteps(data) {
        data.forEach((item, index) => {
            const step = document.createElement('div');
            step.classList.add(
                'step', 'min-h-screen', 'flex', 'items-center',
                'justify-center', 'p-8', 'transition-opacity', 'duration-500'
            );
            step.setAttribute('data-step', index);
            step.setAttribute('data-theme', item.theme);
            step.setAttribute('data-id', item.id);

            // Alignment
            let alignmentClasses = '';
            if (item.alignment === 'left') alignmentClasses = 'mr-auto text-left';
            else if (item.alignment === 'right') alignmentClasses = 'ml-auto text-right';
            else alignmentClasses = 'mx-auto text-center';

            // Content Box
            const contentBox = document.createElement('div');
            contentBox.classList.add(
                'bg-black', 'bg-opacity-80', 'backdrop-blur-md',
                'border', 'border-gray-700', 'p-8', 'rounded-lg',
                'shadow-2xl', 'max-w-xl', 'transform',
                'transition-transform', 'duration-500', 'hover:scale-105'
            );
            contentBox.className += ` ${alignmentClasses}`;

            // ---------------------------------------------------
            // TITLE
            // ---------------------------------------------------
            if (item.title) {
                const title = document.createElement('h2');
                title.className =
                    'text-5xl font-DontStarve mb-6 text-[#bb8354] uppercase tracking-widest whitespace-pre-line';
                title.innerText = item.title;
                contentBox.appendChild(title);
            }

            // SUBTITLE
            if (item.subtitle) {
                const subtitle = document.createElement('h3');
                subtitle.className = 'text-3xl font-semibold mb-8 text-gray-400';
                subtitle.innerText = item.subtitle;
                contentBox.appendChild(subtitle);
            }

            // ---------------------------------------------------
            // MAIN TEXT
            // ---------------------------------------------------
            if (item.text) {
                const text = document.createElement('p');
                text.className = 'text-2xl leading-relaxed text-gray-300 mb-8';
                text.innerHTML = item.text;
                contentBox.appendChild(text);
            }

            // ---------------------------------------------------
            // Main QUOTES before text2 (quote2 → quote10)
            // ---------------------------------------------------
            for (let i = 2; i <= 10; i++) {
                let key = `quote${i}`;
                if (item[key] && !item[`text2`]) {
                    const quote = document.createElement('blockquote');
                    quote.className =
                        'border-l-4 border-purple-500 pl-6 italic text-gray-400 font-BelisaPlumilla text-[1.4rem] text-right mt-6';
                    quote.innerHTML = item[key];
                    contentBox.appendChild(quote);
                }
            }

            // ---------------------------------------------------
            // MAIN IMAGE + CAPTION
            // ---------------------------------------------------
            if (item.image) {
                const img = document.createElement('img');
                img.src = item.image;
                img.className = "my-8 mx-auto rounded-lg shadow-lg";
                contentBox.appendChild(img);

                if (item.caption) {
                    const caption = document.createElement('p');
                    caption.className = "text-[1.2rem] text-gray-400 italic text-center mt-2 mb-8";
                    caption.innerHTML = item.caption;
                    contentBox.appendChild(caption);
                }
            }

            // ---------------------------------------------------
            // EXTRA SECTIONS (text2 → text10)
            // Each gets its own quotes and images
            // ---------------------------------------------------
            for (let i = 2; i <= 10; i++) {
                const textKey = `text${i}`;
                const imageKey = `image${i}`;
                const captionKey = `caption${i}`;
                const quoteKey = `quote${i}`;

                // Extra TEXT
                if (item[textKey]) {
                    const extraText = document.createElement('p');
                    extraText.className =
                        'text-2xl leading-relaxed text-gray-300 mb-8';
                    extraText.innerHTML = item[textKey];
                    contentBox.appendChild(extraText);

                    // AFTER this text → show remaining quotes with numbers > this i
                    for (let q = 2; q <= 10; q++) {
                        if (q > i && item[`quote${q}`]) {
                            const quote = document.createElement('blockquote');
                            quote.className =
                                'border-l-4 border-purple-500 pl-6 italic text-gray-400 font-BelisaPlumilla text-[1.4rem] text-right mt-6';
                            quote.innerHTML = item[`quote${q}`];
                            contentBox.appendChild(quote);

                            // mark as shown
                            item[`quote${q}__shown`] = true;
                        }
                    }
                }

                // Extra IMAGE
                if (item[imageKey]) {
                    const img = document.createElement('img');
                    img.src = item[imageKey];
                    img.className = "my-8 mx-auto rounded-lg shadow-lg";
                    contentBox.appendChild(img);

                    if (item[captionKey]) {
                        const caption = document.createElement('p');
                        caption.className = "text-[1.2rem] text-gray-400 italic text-center mt-2 mb-8";
                        caption.innerHTML = item[captionKey];
                        contentBox.appendChild(caption);
                    }
                }

                // Quotes matching this exact number (quote2 right after text2)
                if (item[quoteKey] && !item[`${quoteKey}__shown`]) {
                    const quote = document.createElement('blockquote');
                    quote.className =
                        'border-l-4 border-purple-500 pl-6 italic text-gray-400 font-BelisaPlumilla text-[1.4rem] text-right mt-6';
                    quote.innerHTML = item[quoteKey];
                    contentBox.appendChild(quote);

                    item[`${quoteKey}__shown`] = true;
                }
            }

            // ---------------------------------------------------
            // FINAL QUOTE (always last)
            // ---------------------------------------------------
            if (item.quote) {
                const finalQuote = document.createElement('blockquote');
                finalQuote.className =
                    'border-l-4 border-purple-500 pl-6 italic text-gray-400 font-BelisaPlumilla text-[1.4rem] text-right mt-8';
                finalQuote.innerHTML = item.quote;
                contentBox.appendChild(finalQuote);
            }

            step.appendChild(contentBox);
            stepsContainer.appendChild(step);
        });
    }

    // SCROLLAMA
    function initScrollama() {
        scroller
            .setup({
                step: '.step',
                offset: 0.5,
                debug: false
            })
            .onStepEnter(response => {
                const step = response.element;
                const theme = step.getAttribute('data-theme');
                const id = step.getAttribute('data-id');

                updateVisuals(theme, id);

                document.querySelectorAll('.step').forEach(s => s.classList.remove('opacity-100'));
                document.querySelectorAll('.step').forEach(s => s.classList.add('opacity-30'));
                step.classList.remove('opacity-30');
                step.classList.add('opacity-100');
            });

        window.addEventListener('resize', scroller.resize);
    }

    // VISUALS
    function updateVisuals(theme, id) {
        visualContainer.className =
            'sticky top-0 h-screen flex flex-col items-center justify-center z-0 transition-colors duration-700 ease-in-out bg-cover bg-center';
        visualContent.innerHTML = '';

        let bgClass = 'bg-gray-900';
        let contentHtml = '';

        const imageMap = {
            'intro': "WX-78_AND_JIMMY_BG.png",
            'origin': 'WX-78_WOODROW_FLASHBACKS.gif',
            'facade': 'WX-78_MURDER_SPREE.jpg',
            'hypocrisy': 'WXWOOD_CANON.jpg',
            'loneliness': 'WX-78_AND_JIMMY_BG.png',
            'soft_spots': 'WX-78_EMPATHY_MODULE_REMOVAL.gif',
            'connection': 'WXWOOD_FARMING.PNG',
            'conclusion': 'WXWOOD_CANON_HAPPY_ENDING.jpg'
        };

        if (imageMap[id]) {
            visualContainer.style.backgroundImage = `url("${imageMap[id]}")`;
            bgClass = '';
        } else {
            visualContainer.style.backgroundImage = 'none';
        }

        switch (theme) {
            case 'glitch':
                contentHtml =
                    `<div class="text-6xl font-black text-white opacity-70 px-8">01110100 01101111 01101111 00100000 01101100 01100001 01110100 01100101 01110100 01101111 01101111 00100000 01101100 01100001 01110100 01100101 01110100 01101111 01101111 00100000 01101100 01100001 01110100 01100101</div>`;
                break;
            case 'nature-tech':
                contentHtml =
                    `<div class="text-6xl font-bold opacity-90 px-8" style="color: #000000ff;">EMPATHY MODULE... RESPONDING?</div>`;
                break;
            case 'light':
                contentHtml =
                    `<div class="text-6xl font-bold text-white opacity-70 px-8">A CERTAIN FAMILIAL AFFECTION FOR MACHINES</div>`;
                break;
            case 'dark':
            default:
                contentHtml =
                    `<div class="text-9xl font-black text-white opacity-70">WX-78</div>`;
                break;
            case 'conclusion':
                contentHtml =
                    `<div class="text-6xl font-bold opacity-90 px-8" style="color: #000000ff;">
completely unrelated to this analysis (not really) but Wxwood are totally gay for each other, it&#39;s canon, my dad works for Klei /j
</div>`;
                break;
            case 'trust-and-daddy-issues-they-just-like-me-fr':
                contentHtml =
                    `<div class="text-6xl font-black text-white opacity-70">this robot has trust and daddy issues they're just like me fr</div>`;
                break;
            case 'evil?':
                contentHtml =
                    `<div class="text-6xl font-black text-white opacity-70">The real WX-78 or just a facade?</div>`;
                break;
        }

        if (bgClass) visualContainer.classList.add(bgClass);
        visualContent.innerHTML = contentHtml;
    }
});
