import { json } from'@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import openai from '../openai/config/openaiConfig'; // Importer la configuration OpenAI
import { v4 as uuidv4 } from 'uuid';
console.log('openai', openai);


// Fonction utilitaire pour détecter le dialecte
function detectDialect(fileContent) {
  console.log('Contenu du fichier:', fileContent);

  if (fileContent.includes('SERIAL')) {
    console.log('Dialecte détecté : PostgreSQL');
    return 'PostgreSQL';
  }
  if (fileContent.includes('GO')) {
    console.log('Dialecte détecté : SQLServer');
    return 'SQLServer';
  }
  if (fileContent.includes('PL/SQL')) {
    console.log('Dialecte détecté : Oracle');
    return 'Oracle';
  }

  console.log('Dialecte non reconnu');
  return 'Unknown';
}






async function convertToMySQL(fileContent, dialect) {
  console.log(`Dialecte détecté: ${dialect}`);
  
  if (dialect === 'PostgreSQL') {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a database conversion expert.' },
          { role: 'user', content: `Convert the following PostgreSQL query to MySQL: ${fileContent}` }
        ],
        max_tokens: 3000,
        temperature: 0.3
      });

      console.log('Réponse OpenAI:', response);

      if (response && response.choices && response.choices.length > 0) {
        fileContent = response.choices[0].message.content.trim();
      } else {
        throw new Error('Réponse de l\'API OpenAI vide ou mal formatée.');
      }
    } catch (error) {
      console.error('Erreur lors de la conversion via OpenAI:', error);
      fileContent = 'Erreur lors de la conversion automatique.';
    }
  } else {
    console.log(`Dialecte non reconnu ou non pris en charge: ${dialect}`);
    fileContent = 'Dialecte non reconnu ou non pris en charge.';
  }

  return fileContent;
}

    

// Fonction utilitaire pour la conversion manuelle
// function manualConversion(content) {
//   // Remplacer "SERIAL" par "INT AUTO_INCREMENT"
//   content = content.replace(/\bSERIAL\b/g, 'INT AUTO_INCREMENT');

//    // Remplacer "INT4" par "INT"
//    content = content.replace(/\bINT4\b/g, 'INT');

//   // Remplacer les types ENUM PostgreSQL par les types ENUM MySQL directement dans la colonne
//   content = content.replace(/\bCREATE TYPE \w+ AS ENUM \(([^)]+)\);/g, ''); // Supprime la définition du type ENUM
  
//   // Remplacer FILETYPE par le type ENUM directement dans la colonne
//   content = content.replace(/\bFILE_TYPE\s+FILETYPE/g, "FILE_TYPE ENUM('file', 'directory')"); // Ajoute ENUM directement dans la colonne


//    // Remplacer les références de clés étrangères pour MySQL, sans valeur par défaut pour FILE_PARENT
//    content = content.replace(/FILE_PARENT\s+INT\s+NOT\s+NULL\s+DEFAULT\s+0\s+REFERENCES\s+\w+\s*\((\w+)\)/gi, 'FILE_PARENT INT NOT NULL REFERENCES FILE($1)');

//   // Gérer les références de clés étrangères pour MySQL
// content = content.replace(/REFERENCES\s+(\w+)\s*\((\w+)\)/gi, 'REFERENCES `$1`(`$2`)');

//   // Remplacer les contraintes de suppression et de mise à jour
//   content = content.replace(/ON DELETE RESTRICT/gi, 'ON DELETE NO ACTION');
//   content = content.replace(/ON UPDATE RESTRICT/gi, 'ON UPDATE NO ACTION');

//   // Assurer le placement correct des références dans les clés étrangères
//   content = content.replace(/REFERENCES FILE\s*\((\w+)\)\s+ON UPDATE\s+NO ACTION\s+ON DELETE\s+NO ACTION/g, 'REFERENCES FILE($1) ON UPDATE NO ACTION ON DELETE NO ACTION');

//   // Remplacer les types ENUM PostgreSQL par les types ENUM MySQL directement dans la colonne
// content = content.replace(/\b(\w+_TYPE)\s+(\w+)\s+NOT\s+NULL\s+DEFAULT\s+'(\w+)'/g, (match, p1, p2, p3) => {
//     const enumValuesMatch = /ENUM\s*\(([^)]+)\)/.exec(content);
//     if (enumValuesMatch) {
//         const enumValues = enumValuesMatch[1]
//             .split(',')
//             .map(v => v.trim().replace(/'/g, ''))
//             .map(v => `'${v}'`)
//             .join(', ');
//         return `${p1} ENUM(${enumValues}) NOT NULL DEFAULT '${p3}'`;
//     }
//     return match;
// });
//   return content;
// }









// Route POST pour gérer la conversion
export async function POST({ request }) {
  try {
    const { fileContent } = await request.json();
    const detectedDialect = detectDialect(fileContent);
    const convertedContent = await convertToMySQL(fileContent, detectedDialect);

    if (!convertedContent || convertedContent.includes('Dialecte non reconnu')) {
      return json({ message: 'Erreur : dialecte non pris en charge ou fichier incorrect.' }, { status: 400 });
    }

    const uniqueFileName = `converted_${uuidv4()}.sql`;
    const uploadDir = path.join('static', 'uploads');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const outputFile = path.join(uploadDir, uniqueFileName);
    fs.writeFileSync(outputFile, convertedContent, 'utf8');

    return json({ message: 'Fichier converti avec succès', filePath: `/uploads/${uniqueFileName}` });
  } catch (error) {
    console.error('Erreur lors de la conversion :', error);
    return json({ message: 'Erreur lors de la conversion du fichier.' }, { status: 500 });
  }
}