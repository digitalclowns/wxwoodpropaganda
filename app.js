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

            // -------------------------
            // Title & Subtitle (always first)
            // -------------------------
            if (item.title) {
                const title = document.createElement('h2');
                title.className =
                    'text-5xl font-DontStarve mb-6 text-[#bb8354] uppercase tracking-widest whitespace-pre-line';
                title.innerText = item.title;
                contentBox.appendChild(title);
            }

            if (item.subtitle) {
                const subtitle = document.createElement('h3');
                subtitle.className = 'text-3xl font-semibold mb-8 text-gray-400';
                subtitle.innerText = item.subtitle;
                contentBox.appendChild(subtitle);
            }

            // -------------------------
            // Render keys in the order they appear in content.json
            // This gives me exact control: place "quote2" before "text2" in JSON to render quote2 first.
            // We'll skip the final unnumbered "quote" during this pass and append it at the end.
            // -------------------------
            const keys = Object.keys(item);
            // track which caption keys have been consumed when image was handled immediately prior
            const handled = new Set();

            for (let k of keys) {
                // skip some keys we've already handled or shouldn't render in this loop
                if (k === 'title' || k === 'subtitle' || k === 'id' || k === 'section' || k === 'theme' || k === 'alignment') continue;
                if (k === 'quote') continue; // final quote handled later

                // If we already rendered this key (e.g., caption consumed with an earlier image), skip
                if (handled.has(k)) continue;

                // MAIN text or numbered text
                if (k === 'text' || /^text\d+$/.test(k)) {
                    const p = document.createElement('p');
                    p.className = 'text-2xl leading-relaxed text-gray-300 mb-8';
                    p.innerHTML = item[k];
                    contentBox.appendChild(p);
                    handled.add(k);
                    continue;
                }

                // IMAGE (main or numbered)
                if (k === 'image' || /^image\d+$/.test(k)) {
                    const img = document.createElement('img');
                    img.src = item[k];
                    img.className = "my-8 mx-auto rounded-lg shadow-lg";
                    contentBox.appendChild(img);
                    handled.add(k);

                    // corresponding caption: caption or captionN
                    const captionKey = k === 'image' ? 'caption' : `caption${k.replace('image', '')}`;
                    if (item[captionKey]) {
                        const caption = document.createElement('p');
                        caption.className = "text-[1.2rem] text-gray-400 italic text-center mt-2 mb-8";
                        caption.innerHTML = item[captionKey];
                        contentBox.appendChild(caption);
                        handled.add(captionKey);
                    }
                    continue;
                }

                // CAPTION alone (in case someone puts caption before image) — render, but it's unusual
                if (k === 'caption' || /^caption\d+$/.test(k)) {
                    // only render if not already handled
                    if (!handled.has(k)) {
                        const caption = document.createElement('p');
                        caption.className = "text-[1.2rem] text-gray-400 italic text-center mt-2 mb-8";
                        caption.innerHTML = item[k];
                        contentBox.appendChild(caption);
                        handled.add(k);
                    }
                    continue;
                }

                // Numbered quotes (quote2, quote3, ...)
                if (/^quote\d+$/.test(k)) {
                    const quote = document.createElement('blockquote');
                    quote.className =
                        'border-l-4 border-purple-500 pl-6 italic text-gray-400 font-BelisaPlumilla text-[1.4rem] text-left mt-6';
                    quote.innerHTML = item[k];
                    contentBox.appendChild(quote);
                    handled.add(k);
                    continue;
                }

                // Any other key (safe fallback) — render as paragraph
                if (!handled.has(k)) {
                    const fallback = document.createElement('p');
                    fallback.className = 'text-2xl leading-relaxed text-gray-300 mb-8';
                    fallback.innerHTML = item[k];
                    contentBox.appendChild(fallback);
                    handled.add(k);
                }
            }

            // -------------------------
            // FINAL QUOTE (always last)
            // -------------------------
            if (item.quote) {
                const finalQuote = document.createElement('blockquote');
                finalQuote.className =
                    'border-l-4 border-purple-500 pl-6 italic text-gray-400 font-BelisaPlumilla text-[1.4rem] text-left mt-8';
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
                    `<div class="text-6xl font-bold text-white opacity-70 px-8">A CERTAIN FAMILIAL AFFECTION FOR MACHINES (AND PERHAPS OTHERS?)(AKA WORMWOOD)</div>`;
                break;
            case 'dark':
            default:
                contentHtml =
                    `<div class="text-9xl font-black text-white opacity-70">WX-78</div>`;
                break;
            case 'conclusion':
                contentHtml =
                    `<div class="text-6xl font-bold opacity-90 px-8" style="color: #000000ff;">
completely unrelated to this analysis (not really) but Wxwood are totally gay for each other, it's canon, my dad works for Klei /j
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