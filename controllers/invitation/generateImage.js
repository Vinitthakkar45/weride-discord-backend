import path from 'path';
import sharp from 'sharp';  

const generateImage = async function generatePersonalizedImage(templatePath, userName) {
    try {
        const outputPath = path.join(process.cwd(), `${userName}.png`);

        const image = sharp(templatePath);
        const metadata = await image.metadata();
        const svgText = `<svg width="${metadata.width}" height="${metadata.height}">
                <style>
                    .uname {
                        fill: white; 
                        font-size: 85px; 
                        font-weight: bold; 
                        text-anchor: middle; 
                        font-family: 'Comic Sans MS', cursive, sans-serif;
                        filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.5)); 
                    }
                </style>
                <text x="50%" y="95%" class="uname">${userName}</text>
            </svg>`;
        await image
            .composite([{ input: Buffer.from(svgText), blend: 'over' }])
            .toFile(outputPath);

        return outputPath;
    } catch (err) {
        console.error('Error generating image:', err);
        throw err;
    }
}

export {generateImage}