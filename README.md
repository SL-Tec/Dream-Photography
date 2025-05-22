# Dream Photography - Single Page Website

A modern, responsive single-page website for a photography business, featuring smooth animations, interactive elements, and a beautiful Three.js background.

## Features

- Responsive design that works on all devices
- Modern UI with smooth animations and transitions
- Interactive Three.js particle background in the hero section
- Dynamic portfolio gallery
- Testimonials slider
- Contact form with validation
- Mobile-friendly navigation
- SEO optimized
- Fast loading and performance optimized

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Tailwind CSS
- Three.js
- Font Awesome Icons

## Project Structure

```
dream-photography/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
├── assets/
│   └── images/
│       ├── portfolio/
│       └── photographer.jpg
└── README.md
```

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/yourusername/dream-photography.git
```

2. Navigate to the project directory:
```bash
cd dream-photography
```

3. Open `index.html` in your web browser or use a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve
```

4. Visit `http://localhost:8000` in your web browser.

## Customization

### Adding Portfolio Items

To add new portfolio items, edit the `portfolioItems` array in `js/main.js`:

```javascript
const portfolioItems = [
    {
        image: 'assets/images/portfolio/your-image.jpg',
        category: 'Category',
        title: 'Image Title'
    },
    // Add more items...
];
```

### Modifying Testimonials

To update testimonials, edit the `testimonials` array in `js/main.js`:

```javascript
const testimonials = [
    {
        name: 'Client Name',
        role: 'Client Role',
        text: 'Testimonial text...'
    },
    // Add more testimonials...
];
```

### Changing Colors

The main colors can be modified in the CSS variables section of `css/style.css`:

```css
:root {
    --primary-color: #3b82f6;
    --secondary-color: #1e40af;
    --accent-color: #f59e0b;
    /* Add more colors... */
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## Performance Optimization

- Images are optimized for web
- CSS and JavaScript are minified
- Lazy loading for images
- Efficient animations using CSS transforms
- Three.js background is optimized for performance

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Your Name - your.email@example.com
Project Link: https://github.com/yourusername/dream-photography 