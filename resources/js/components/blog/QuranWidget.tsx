import { useEffect } from 'react';

export const QuranWidget = () => {
    useEffect(() => {
        // Load the script dynamically
        const script = document.createElement('script');
        script.src = 'https://quran-app.kajianislamsangatta.com/embed.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            // Cleanup: remove the script when component unmounts
            // Check if script is still in body before removing
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
            
            // Optionally clean up the injected styles/elements if the embed script doesn't handle it
            const widgetElement = document.getElementById('quran-digital-widget');
            if (widgetElement) {
                widgetElement.innerHTML = '';
            }
        };
    }, []);

    return (
        <div className="w-full min-h-[600px] flex justify-center bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden shadow-inner">
            <div id="quran-digital-widget" className="w-full max-w-4xl"></div>
        </div>
    );
};
