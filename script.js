document.addEventListener('DOMContentLoaded', function() {
    const backdropSection = document.getElementById('backdrop-section');
    const leftStripes = document.querySelectorAll('.left-stripes .stripe');
    const rightStripes = document.querySelectorAll('.right-stripes .stripe');
    
    // Initial positions for left stripes (off-screen left)
    const leftInitialPositions = [-80, -90, -70];
    // Initial positions for right stripes (off-screen right)  
    const rightInitialPositions = [-80, -90, -70];
    
    // Target positions when stripes meet (center-ish)
    const leftTargetPositions = [-10, -20, 0];
    const rightTargetPositions = [-10, -20, 0];
    
    function updateStripesPosition() {
        const sectionRect = backdropSection.getBoundingClientRect();
        const sectionHeight = backdropSection.offsetHeight;
        const viewportHeight = window.innerHeight;
        
        // Calculate scroll progress within the backdrop section (0 to 1)
        let scrollProgress = 0;
        
        if (sectionRect.top <= 0 && sectionRect.bottom >= viewportHeight) {
            // We're inside the section
            scrollProgress = Math.abs(sectionRect.top) / (sectionHeight - viewportHeight);
        } else if (sectionRect.top > 0) {
            // Section hasn't entered viewport yet
            scrollProgress = 0;
        } else {
            // Section has passed completely
            scrollProgress = 1;
        }
        
        // Clamp scroll progress between 0 and 1
        scrollProgress = Math.max(0, Math.min(1, scrollProgress));
        
        // Apply easing function for smoother animation
        const easedProgress = easeInOutCubic(scrollProgress);
        
        // Update left stripes
        leftStripes.forEach((stripe, index) => {
            const initialPos = leftInitialPositions[index];
            const targetPos = leftTargetPositions[index];
            const currentPos = initialPos + (targetPos - initialPos) * easedProgress;
            
            stripe.style.left = `${currentPos}%`;
            
            // Add subtle rotation based on scroll
            const rotation = -8 + (easedProgress * 2);
            stripe.style.transform = `skewY(${rotation}deg)`;
        });
        
        // Update right stripes
        rightStripes.forEach((stripe, index) => {
            const initialPos = rightInitialPositions[index];
            const targetPos = rightTargetPositions[index];
            const currentPos = initialPos + (targetPos - initialPos) * easedProgress;
            
            stripe.style.right = `${currentPos}%`;
            
            // Add subtle rotation based on scroll
            const rotation = -8 - (easedProgress * 2);
            stripe.style.transform = `skewY(${rotation}deg)`;
        });
        
        // Add opacity animation
        const opacity = Math.min(1, scrollProgress * 2);
        [...leftStripes, ...rightStripes].forEach(stripe => {
            stripe.style.opacity = opacity;
        });
    }
    
    // Easing function for smoother animation
    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }
    
    // Throttle function to improve performance
    function throttle(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Add scroll event listener with throttling
    const throttledUpdate = throttle(updateStripesPosition, 16); // ~60fps
    window.addEventListener('scroll', throttledUpdate);
    window.addEventListener('resize', throttledUpdate);
    
    // Initial call
    updateStripesPosition();
    
    // Add some random movement on hover for extra effect
    [...leftStripes, ...rightStripes].forEach(stripe => {
        stripe.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.3s ease';
            const currentTransform = this.style.transform;
            this.style.transform = currentTransform + ' scale(1.02)';
        });
        
        stripe.addEventListener('mouseleave', function() {
            this.style.transition = 'transform 0.1s ease-out';
            const currentTransform = this.style.transform;
            this.style.transform = currentTransform.replace(' scale(1.02)', '');
        });
    });
});