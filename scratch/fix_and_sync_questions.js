require('dotenv').config();
const fs = require('fs');
const path = require('path');
const connectDatabase = require('../db/connection');
const Question = require('../models/Question');

const questionsPath = path.join(__dirname, '../data/questions.json');
const rawQuestions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

console.log(`Starting analysis and correction on ${rawQuestions.length} questions...`);

const corrections = [];

const cleanText = (str) => {
  if (!str) return '';
  return str.trim();
};

const updatedQuestions = rawQuestions.map((q, index) => {
  const item = { ...q };

  // 1. Chapter 13 Question 10 (idx 9 in raw questions)
  if (item.chapterId === 13 && item.questionText.includes('Your eyes struggle adjusting from light to dark')) {
    corrections.push(`Ch 13 Q10: Fixed duplicate question text & empty answer`);
    item.questionText = "To help prevent driver fatigue and stay alert while driving at night, you should:";
    item.quesOptions = [
      "maintain a cab temperature of 72-74 degrees",
      "stop at regular intervals to rest or stretch",
      "play loud, upbeat music",
      "consume highly-caffeinated drinks"
    ];
    item.quesAnswer = "stop at regular intervals to rest or stretch";
  }

  // 2. Chapter 15 Question 8 (idx 17 in raw questions)
  if (item.chapterId === 15 && item.questionText.includes('actions can you take to identify hazards early')) {
    corrections.push(`Ch 15 Q8: Filled missing answer`);
    item.quesOptions = [
      "Use your mirrors to scan behind and to the sides of your vehicle. Look 12-15 seconds ahead of your vehicle.",
      "Maintain three seconds of space between your truck and the vehicle in front of you",
      "Tune your radio to a local channel to hear any hazard warnings"
    ];
    item.quesAnswer = "Use your mirrors to scan behind and to the sides of your vehicle. Look 12-15 seconds ahead of your vehicle.";
  }

  // 3. Chapter 1 Question 4: CDL Endorsement vs Restriction
  if (item.chapterId === 1 && item.questionText.includes('requires an endorsement on your CDL')) {
    corrections.push(`Ch 1 Q4: Corrected CDL endorsement answer from 'Air brakers' to 'Double/triple trailers'`);
    item.quesOptions = [
      "Manual transmission",
      "using an ELD",
      "Air brakes",
      "Double/triple trailers"
    ];
    item.quesAnswer = "Double/triple trailers";
  }

  // 4. Chapter 7 Question 5: Landing gear safety
  if (item.chapterId === 7 && item.questionText.includes("safest way to lower and raise your trailer's landing gear")) {
    corrections.push(`Ch 7 Q5: Corrected landing gear safety answer from hazardous wrist wrap to proper stance`);
    item.quesOptions = [
      "Face the trailer and spin the crank handle around your wrist",
      "Face parallel to the trailer and use two hands",
      "Face parallel to the trailer and rest one hand on the trailer",
      "Face the trailer, keep your feet apart, and rest one hand on the trailer"
    ];
    item.quesAnswer = "Face the trailer, keep your feet apart, and rest one hand on the trailer";
  }

  // 5. Chapter 31 Question 9: Information when reporting human trafficking
  if (item.chapterId === 31 && item.questionText.includes('When contacting authorities, which information should you provide')) {
    corrections.push(`Ch 31 Q9: Corrected human trafficking reporting answer to location/details`);
    item.quesOptions = [
      "Address description or location, time and date, detailed description of any vehicles or people involved.",
      "That is not necessary to document",
      "A list of possible outcomes if they don't"
    ];
    item.quesAnswer = "Address description or location, time and date, detailed description of any vehicles or people involved.";
  }

  // 6. Chapter 29 Question 5: Clean duplicate/empty options in alcohol testing
  if (item.chapterId === 29 && item.questionText.includes('Alcohol testing is done in a private setting')) {
    corrections.push(`Ch 29 Q5: Removed empty option elements and cleaned text`);
    item.quesOptions = [
      "Nurse practitioner or Physician",
      "Screening Test Technician or Breath Alcohol Technician (BAT)"
    ];
    item.quesAnswer = "Screening Test Technician or Breath Alcohol Technician (BAT)";
  }

  // 7. Chapter 2 Question 3: Typo "Disengaged aged" -> "Disengaged"
  if (item.chapterId === 2 && item.questionText.includes('clutch position is required to start the engine')) {
    corrections.push(`Ch 2 Q3: Fixed 'Disengaged aged' typo`);
    item.quesOptions = item.quesOptions.map(o => o.replace(/Disengaged aged/i, 'Disengaged'));
    item.quesAnswer = "Disengaged";
  }

  // 8. Chapter 31 Question 2: Domestic -> Domestic servitude
  if (item.chapterId === 31 && item.questionText.includes('works in a private residence as a nanny, maid')) {
    corrections.push(`Ch 31 Q2: Fixed 'Domestic' to 'Domestic servitude'`);
    item.quesOptions = item.quesOptions.map(o => o.trim() === 'Domestic' ? 'Domestic servitude' : o);
    item.quesAnswer = "Domestic servitude";
  }

  // 9. Chapter 31 Question 5: OCR typo "hurt-Ian trafficking" -> "human trafficking"
  if (item.chapterId === 31 && item.questionText.includes('hurt-Ian')) {
    corrections.push(`Ch 31 Q5: Fixed OCR typo 'hurt-Ian' to 'human'`);
    item.questionText = item.questionText.replace('hurt-Ian', 'human');
  }

  // 10. Chapter 31 Question 10: Incomplete question sentence
  if (item.chapterId === 31 && item.questionText.includes('report possible human trafficking to federal law')) {
    corrections.push(`Ch 31 Q10: Completed truncated question text`);
    item.questionText = "What number do you call to report possible human trafficking to federal law enforcement?";
  }

  // 11. Chapter 30 Question 2: Truncated option/answer
  if (item.chapterId === 30 && item.questionText.includes('disqualified from driving a CMV if he or she')) {
    corrections.push(`Ch 30 Q2: Fixed truncated 'left the scene of an accident with a' to 'left the scene of an accident with a CMV'`);
    item.quesOptions = [
      "drove a CMV while smoking or vaping",
      "spends too much time in the sleeper berth",
      "left the scene of an accident with a CMV",
      "drove the CMV for personal use"
    ];
    item.quesAnswer = "left the scene of an accident with a CMV";
  }

  // 12. Chapter 28 Question 8: Missing "miles"
  if (item.chapterId === 28 && item.questionText.includes('allow two hours for every traveled')) {
    corrections.push(`Ch 28 Q8: Clarified question text 'every 100 miles traveled'`);
    item.questionText = "A general guideline used by many drivers is to allow two hours for every _____ miles traveled:";
    item.quesOptions = ["100", "128", "75", "150"];
    item.quesAnswer = "100";
  }

  // 13. Chapter 28 Question 5: OCR typo "IOW overpasses" -> "low overpasses"
  if (item.chapterId === 28 && item.questionText.includes('IOW overpasses')) {
    corrections.push(`Ch 28 Q5: Fixed OCR typo 'IOW' to 'low'`);
    item.questionText = item.questionText.replace('IOW', 'low');
  }

  // 14. Chapter 28 Question 9: OCR typo "tan k" -> "tank"
  if (item.chapterId === 28 && item.questionText.includes('tan k')) {
    corrections.push(`Ch 28 Q9: Fixed 'tan k' to 'tank'`);
    item.quesOptions = item.quesOptions.map(o => o.replace('tan k', 'tank'));
    item.quesAnswer = item.quesAnswer.replace('tan k', 'tank');
  }

  // 15. Chapter 17 Question 5: OCR typo "yellow sing" -> "yellow sign"
  if (item.chapterId === 17 && item.questionText.includes('yellow sing')) {
    corrections.push(`Ch 17 Q5: Fixed OCR typo 'sing' to 'sign'`);
    item.questionText = item.questionText.replace('yellow sing', 'yellow sign');
  }

  // 16. Chapter 14 Question 7: Typo "tree basic causes" -> "three basic causes"
  if (item.chapterId === 14 && item.questionText.includes('tree basic causes')) {
    corrections.push(`Ch 14 Q7: Fixed typo 'tree' to 'three'`);
    item.questionText = item.questionText.replace('tree basic causes', 'three basic causes');
  }

  // 17. Chapter 13 Question 8: Typo "tum signals" -> "turn signals"
  if (item.chapterId === 13 && item.questionText.includes('tum signals') || (item.quesAnswer && item.quesAnswer.includes('tum signals'))) {
    corrections.push(`Ch 13 Q8: Fixed typo 'tum signals' to 'turn signals'`);
    item.quesOptions = item.quesOptions.map(o => o.replace(/tum signals/g, 'turn signals'));
    item.quesAnswer = item.quesAnswer.replace(/tum signals/g, 'turn signals');
  }

  // 18. Chapter 12 Question 7: Typo "tractor-traitor" -> "tractor-trailer"
  if (item.chapterId === 12 && (item.questionText.includes('tractor-traitor') || item.quesAnswer.includes('tractor-traitor'))) {
    corrections.push(`Ch 12 Q7: Fixed typo 'tractor-traitor' to 'tractor-trailer'`);
    item.quesOptions = item.quesOptions.map(o => o.replace(/tractor-traitor/gi, 'tractor-trailer'));
    item.quesAnswer = item.quesAnswer.replace(/tractor-traitor/gi, 'tractor-trailer');
  }

  // 19. Chapter 12 Question 10: Typo "earl safely" -> "can safely"
  if (item.chapterId === 12 && item.quesAnswer.includes('earl safely')) {
    corrections.push(`Ch 12 Q10: Fixed typo 'earl safely' to 'can safely'`);
    item.quesOptions = item.quesOptions.map(o => o.replace(/earl safely/gi, 'can safely'));
    item.quesAnswer = item.quesAnswer.replace(/earl safely/gi, 'can safely');
  }

  // 20. Chapter 10 Question 5: Typo "actions ma be permissible" -> "actions may be permissible"
  if (item.chapterId === 10 && item.questionText.includes('actions ma be')) {
    corrections.push(`Ch 10 Q5: Fixed typo 'ma be' to 'may be'`);
    item.questionText = item.questionText.replace('actions ma be', 'actions may be');
  }

  // 21. Chapter 26 Question 10: Space after semicolon in options
  if (item.chapterId === 26 && item.questionText.includes('If English is not your first language')) {
    corrections.push(`Ch 26 Q10: Normalized semicolon spacing`);
    const cleanOpt = "read. write. and speak well enough to make entries, Reports and answer questions from law enforcement; understand highway traffic Signs and Signals written in English.";
    item.quesOptions = [
      "understand and communicate with universal hand signals or communicate in at least one of the other top five spoken languages in the US",
      cleanOpt
    ];
    item.quesAnswer = cleanOpt;
  }

  // 22. General Cleanup: Trim all strings and remove extraneous spaces
  item.questionText = item.questionText.trim();
  item.quesOptions = item.quesOptions
    .map(o => (typeof o === 'string' ? o.trim() : o))
    .filter(o => o && o.length > 0);
  
  if (item.quesAnswer) {
    item.quesAnswer = item.quesAnswer.trim();
    // Ensure exact match with option casing/whitespace
    const match = item.quesOptions.find(o => o.toLowerCase() === item.quesAnswer.toLowerCase());
    if (match) {
      item.quesAnswer = match;
    }
  }

  return item;
});

console.log(`Applied ${corrections.length} specific corrections.`);
corrections.forEach(c => console.log('  - ' + c));

// Validate all questions
let invalidCount = 0;
updatedQuestions.forEach((q, i) => {
  if (!q.quesAnswer || q.quesAnswer.trim() === '') {
    console.error(`ERROR: Empty answer at index ${i}, chapter ${q.chapterId}`);
    invalidCount++;
  }
  if (!q.quesOptions.includes(q.quesAnswer)) {
    console.error(`ERROR: quesAnswer not in quesOptions at index ${i}, chapter ${q.chapterId}`);
    console.error(`  Answer: '${q.quesAnswer}'`);
    console.error(`  Options:`, q.quesOptions);
    invalidCount++;
  }
});

if (invalidCount === 0) {
  console.log('ALL 320 QUESTIONS VALIDATED SUCCESSFULLY! 100% options and answers match exactly.');
  
  // Write back to data/questions.json
  fs.writeFileSync(questionsPath, JSON.stringify(updatedQuestions, null, 2), 'utf8');
  console.log('Saved corrected questions to data/questions.json');

  // Sync to MongoDB Atlas
  connectDatabase().then(async () => {
    console.log('Connected to MongoDB Atlas, updating database collection...');
    
    // Replace collection with clean validated questions
    await Question.deleteMany({});
    await Question.insertMany(updatedQuestions);
    const count = await Question.countDocuments();
    console.log(`MongoDB Atlas updated successfully! Current collection count: ${count}`);
    process.exit(0);
  }).catch(err => {
    console.error('Error syncing to MongoDB:', err);
    process.exit(1);
  });
} else {
  console.error(`Found ${invalidCount} validation errors. Aborting sync.`);
  process.exit(1);
}
