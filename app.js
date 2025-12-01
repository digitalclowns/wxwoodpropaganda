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
                quote.className = 'border-l-4 border-purple-500 pl-6 italic text-gray-400 font-BelisaPlumilla text-xl mt-6';
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
        visualContainer.className = 'sticky top-0 h-screen flex flex-col items-center justify-center z-0 transition-colors duration-700 ease-in-out bg-cover bg-center';
        visualContent.innerHTML = ''; // Clear previous content

        let bgClass = 'bg-gray-900';
        let contentHtml = '';

        // Image Mapping
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
            bgClass = ''; // Clear bg class if image is present
        } else {
            visualContainer.style.backgroundImage = 'none';
        }

        // Custom text overlay based on theme - with increased visibility
        switch (theme) {
            case 'glitch':
                contentHtml = `<div class="text-6xl font-black text-white opacity-70 px-8">01110100 01101111 01101111 00100000 01101100 01100001 01110100 01100101 00100000 01110100 01101111 01101111 00100000 01101100 01100001 01110100 01100101 00100000 01110100 01101111 01101111 00100000 01101100 01100001 01110100 01100101</div>`;
                break;
            case 'nature-tech':
                contentHtml = `<div class="text-6xl font-bold opacity-90 px-8" style="color: #000000ff;">EMPATHY MODULE... RESPONDING?</div>`;
                break;
            case 'light':
                contentHtml = `<div class="text-6xl font-bold text-white opacity-70 px-8">A CERTAIN FAMILIAL AFFECTION FOR MACHINES</div>`;
                break;
            case 'dark':
            default:
                contentHtml = `<div class="text-9xl font-black text-white opacity-70">WX-78</div>`;
                break;
            case 'conclusion':
                contentHtml = `<div class="text-6xl font-bold opacity-90 px-8" style="color: #000000ff;">completely unrelated to this analysis (not really) but Wxwood are totally gay for each other, it's canon, my dad works for Klei /j</div>`;
                break;
            case 'trust-and-daddy-issues-they-just-like-me-fr':
                contentHtml = `<div class="text-6xl font-black text-white opacity-70">this robot has trust and daddy issues they're just like me fr</div>`;
                break;
        }

        if (bgClass) visualContainer.classList.add(bgClass);
        visualContent.innerHTML = contentHtml;
    }
});
