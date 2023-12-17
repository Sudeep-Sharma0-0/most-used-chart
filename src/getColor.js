import fs from 'fs';
import yaml from 'js-yaml';

export function getColor(lang, file) {
  try {
    const fileContents = fs.readFileSync(file, 'utf8');
    const data = yaml.load(fileContents);

    if (data[lang] && data[lang].color) {
      return data[lang].color;
    } else if (lang === "Others") {
      return "#000";
    } else {
      return 'Color not found for this language';
    }
  } catch (err) {
    console.error('Error reading the file:', err);
    return 'Error fetching color';
  }
}
