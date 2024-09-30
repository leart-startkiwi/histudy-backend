const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs").promises; // Use fs.promises for async/await
const path = require("path");
const ffmpegPath = require("ffmpeg-static");
const ffprobePath = require("ffprobe-static").path; // Import ffprobe-static

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath); // Set ffprobe path explicitly

exports.noAmbigiousFields = (tableName, fields) => {
  return fields.map((field) => `${tableName}.${field}`);
};

exports.convertToJson = (tableName, fields, objName) => {
  return `JSON_OBJECT(${fields.map(
    (field) => `'${field}', ${tableName}.${field}`
  )}) AS ${objName}`;
};

exports.joinTables = (
  firstTable,
  foreignKey,
  secondTable,
  secondTableKey = "id",
  joinType = "INNER"
) => {
  return `${joinType} JOIN ${secondTable} ON ${firstTable}.${foreignKey} = ${secondTable}.${secondTableKey}`;
};

exports.convertQueryCondition = (queryObj, acceptKeys = []) => {
  const queryKeys = Object.keys(queryObj);

  const filteredKeys = queryKeys.filter((key) => acceptKeys.includes(key));
  const filteredValues = filteredKeys.map((key) => queryObj[key]);

  const queries = filteredKeys.map((key) => `${key} = ?`);

  if (queries.length === 1) {
    return { queryString: queries[0], queryValues: filteredValues };
  } else {
    const queryString = queries.join(" AND ");
    return { queryString, queryValues: filteredValues };
  }
};

exports.languages = [
  { id: "en", name: "English" },
  { id: "es", name: "Spanish" },
  { id: "fr", name: "French" },
  { id: "de", name: "German" },
  { id: "zh", name: "Chinese" },
  { id: "ar", name: "Arabic" },
  { id: "hi", name: "Hindi" },
  { id: "ru", name: "Russian" },
  { id: "ja", name: "Japanese" },
  { id: "pt", name: "Portuguese" },
  { id: "it", name: "Italian" },
  { id: "ko", name: "Korean" },
  { id: "nl", name: "Dutch" },
  { id: "sv", name: "Swedish" },
  { id: "fi", name: "Finnish" },
  { id: "da", name: "Danish" },
  { id: "no", name: "Norwegian" },
  { id: "pl", name: "Polish" },
  { id: "tr", name: "Turkish" },
  { id: "el", name: "Greek" },
  { id: "cs", name: "Czech" },
  { id: "hu", name: "Hungarian" },
  { id: "ro", name: "Romanian" },
  { id: "he", name: "Hebrew" },
  { id: "th", name: "Thai" },
  { id: "vi", name: "Vietnamese" },
];

exports.prices = [
  { id: "free", name: "Free" },
  { id: "tier1", name: "$19.99 (tier 1)" },
  { id: "tier2", name: "$22.99 (tier 2)" },
  { id: "tier3", name: "$24.99 (tier 3)" },
  { id: "tier4", name: "$27.99 (tier 4)" },
  { id: "tier5", name: "$29.99 (tier 5)" },
  { id: "tier6", name: "$34.99 (tier 6)" },
  { id: "tier7", name: "$39.99 (tier 7)" },
  { id: "tier8", name: "$44.99 (tier 8)" },
  { id: "tier9", name: "$49.99 (tier 9)" },
  { id: "tier10", name: "$54.99 (tier 10)" },
  { id: "tier11", name: "$59.99 (tier 11)" },
  { id: "tier12", name: "$64.99 (tier 12)" },
  { id: "tier13", name: "$69.99 (tier 13)" },
  { id: "tier14", name: "$74.99 (tier 14)" },
  { id: "tier15", name: "$79.99 (tier 15)" },
  { id: "tier16", name: "$84.99 (tier 16)" },
  { id: "tier17", name: "$89.99 (tier 17)" },
  { id: "tier18", name: "$94.99 (tier 18)" },
  { id: "tier19", name: "$99.99 (tier 19)" },
  { id: "tier20", name: "$109.99 (tier 20)" },
  { id: "tier21", name: "$119.99 (tier 21)" },
  { id: "tier22", name: "$124.99 (tier 22)" },
  { id: "tier23", name: "$129.99 (tier 23)" },
  { id: "tier24", name: "$139.99 (tier 24)" },
  { id: "tier25", name: "$149.99 (tier 25)" },
  { id: "tier26", name: "$159.99 (tier 26)" },
  { id: "tier27", name: "$174.99 (tier 27)" },
  { id: "tier28", name: "$189.99 (tier 28)" },
  { id: "tier29", name: "$199.99 (tier 29)" },
];

exports.statuses = [
  { id: "beginner", name: "beginner" },
  { id: "intermediate", name: "intermediate" },
  { id: "advanced", name: "advanced" },
  { id: "expert", name: "expert" },
];

exports.extractVideoDuration = async (filePath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        console.error("Error reading video metadata:", err);
        return reject(err);
      }
      resolve(metadata.format.duration.toFixed(2));
    });
  });
};
