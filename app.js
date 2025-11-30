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
            step.classList.add('step', 'min-h-screen', 'flex', 'items-center', 'justify-center', 'p-8', 'transition-opacity', 'duration-500');
            step.setAttribute('data-step', index);
            step.setAttribute('data-theme', item.theme);
            step.setAttribute('data-id', item.id);

            // Alignment classes
            let alignmentClasses = '';
            if (item.alignment === 'left') alignmentClasses = 'mr-auto text-left';
            else if (item.alignment === 'right') alignmentClasses = 'ml-auto text-right';
            else alignmentClasses = 'mx-auto text-center';

            // Content Box
            const contentBox = document.createElement('div');
            contentBox.classList.add('bg-black', 'bg-opacity-80', 'backdrop-blur-md', 'border', 'border-gray-700', 'p-8', 'rounded-lg', 'shadow-2xl', 'max-w-xl', 'transform', 'transition-transform', 'duration-500', 'hover:scale-105');
            contentBox.className += ` ${alignmentClasses}`;

            // Title
            if (item.title) {
                const title = document.createElement('h2');
                title.className = 'text-5xl font-DontStarve mb-6 text-[#bb8354] uppercase tracking-widest';
                title.innerText = item.title;
                contentBox.appendChild(title);
            }

            // Subtitle
            if (item.subtitle) {
                const subtitle = document.createElement('h3');
                subtitle.className = 'text-3xl font-semibold mb-8 text-gray-400';
                subtitle.innerText = item.subtitle;
                contentBox.appendChild(subtitle);
            }

            // Text
            if (item.text) {
                const text = document.createElement('p');
                text.className = 'text-2xl leading-relaxed text-gray-300 mb-8';
                text.innerHTML = item.text; // Allow HTML for <br>
                contentBox.appendChild(text);
            }

            // Quote
            if (item.quote) {
                const quote = document.createElement('blockquote');
                quote.className = 'border-l-4 border-purple-500 pl-6 italic text-gray-400 font-mono text-xl mt-6';
                quote.innerHTML = `"${item.quote}"`;
                contentBox.appendChild(quote);
            }

            step.appendChild(contentBox);
            stepsContainer.appendChild(step);
        });
    }

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

                // Update Visuals based on theme/id
                updateVisuals(theme, id);

                // Highlight active step
                document.querySelectorAll('.step').forEach(s => s.classList.remove('opacity-100'));
                document.querySelectorAll('.step').forEach(s => s.classList.add('opacity-30'));
                step.classList.remove('opacity-30');
                step.classList.add('opacity-100');
            })
            .onStepExit(response => {
                // Optional: handle exit
            });

        window.addEventListener('resize', scroller.resize);
    }

    function updateVisuals(theme, id) {
        // Reset classes and styles
        visualContainer.className = 'sticky top-0 h-screen flex flex-col items-center justify-center z-0 transition-all duration-700 ease-in-out bg-cover bg-center';
        visualContainer.style.backgroundImage = 'none';
        visualContent.innerHTML = ''; // Clear previous content

        let bgClass = 'bg-gray-900';
        let contentHtml = '';

        // Map IDs to Background Images
        const bgImages = {
            'intro': "WX-78'S_COMPENDIUM.jpg",
            'origin': "WX-78_VS_WOODROW.png",
            'facade': "WX-78_MURDER_SPREE.gif",
            'hypocrisy': "WXWOOD_CANON_(IN MY DREAMS).png",
            'loneliness': "WX-78_AND_JIMMY_BG.png"
        };

        if (bgImages[id]) {
            visualContainer.style.backgroundImage = `url('${bgImages[id]}')`;
            // Add an overlay to ensure text readability if needed
            // contentHtml = `<div class="text-9xl font-black text-white opacity-80 animate-pulse mix-blend-overlay">WX-78</div>`;
            bgClass = '';
        } else {
            // Fallback to themes if no specific image
            switch (theme) {
                case 'glitch':
                    bgClass = 'bg-red-900';
                    contentHtml = `<div class="text-9xl font-black text-white opacity-20 glitch-text" data-text="ERROR">ERROR</div>`;
                    break;
                case 'nature-tech':
                    bgClass = 'bg-green-900';
                    contentHtml = `<div class="text-6xl font-bold text-green-300 opacity-30">ORGANIC<br>SYMBIOSE</div>`;
                    break;
                case 'light':
                    bgClass = 'bg-gray-200';
                    visualContainer.classList.add('text-gray-900'); // Invert text color for light bg
                    contentHtml = `<div class="text-6xl font-bold text-gray-800 opacity-20">SYSTEM<br>ANOMALY</div>`;
                    break;
                case 'dark':
                default:
                    bgClass = 'bg-gray-900';
                    contentHtml = `<div class="text-9xl font-black text-white opacity-10 animate-pulse">WX-78</div>`;
                    break;
            }
        }

        if (bgClass) visualContainer.classList.add(bgClass);
        visualContent.innerHTML = contentHtml;
    }
});
