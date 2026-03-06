const fetch = require('node-fetch').default;

async function testVideoProcessing() {
  try {
    // Test the video processing API with the real analysis video
    const response = await fetch('http://localhost:3001/api/process-video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        videoUrl: 'https://youtu.be/pnWgj8jjs3w?si=T25btKJ30AiYYD1c'
      })
    });

    const result = await response.json();
    console.log('Video processing result:', JSON.stringify(result, null, 2));
    
    if (result.blueprint) {
      console.log('\n=== Blueprint Sections ===');
      result.blueprint.sections.forEach((section, index) => {
        console.log(`${index + 1}. ${section.title}`);
        section.subsections.forEach((subsection, subIndex) => {
          console.log(`   ${subIndex + 1}. [${subsection.timestamp}] ${subsection.title}`);
        });
      });
    }
    
    if (result.flashcards) {
      console.log(`\n=== Generated Flashcards (${result.flashcards.length}) ===`);
      result.flashcards.slice(0, 5).forEach((card, index) => {
        console.log(`${index + 1}. Q: ${card.question.substring(0, 50)}...`);
        console.log(`   A: ${card.answer.substring(0, 50)}...`);
      });
    }
    
  } catch (error) {
    console.error('Error testing video processing:', error);
  }
}

testVideoProcessing();