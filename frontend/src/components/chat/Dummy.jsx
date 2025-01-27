//  if (currentQuestion.name === "jobTitle") {
//             let response;
//             if (typeof userInput === "object") {
//               // Handle object input type
//               response = await fetch(
//                 "http://localhost:3000/occupations/suggestJobAttributes",
//                 {
//                   method: "POST",
//                   headers: { "Content-Type": "application/json" },
//                   body: JSON.stringify(userInput),
//                 }
//               );
//             } else {
//               // Handle string input type
//               response = await fetch("http://localhost:3000/jobs", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ jobTitle: userInput }),
//               });
//             }

//             const data = await response.json();
//             if (data?.onet) {
//               if (data?.onet?.technology_skills) {
//                 setResults((prev) => ({
//                   ...prev,
//                   toolsProficiencies: [...data.onet.technology_skills],
//                 }));
//               }
//             }

//             if (data?.keyProficiencies?.technicalSkills?.tools_and_technology) {
//               setResults((prev) => ({
//                 ...prev,
//                 toolsProficiencies:
//                   data.keyProficiencies.technicalSkills.tools_and_technology.map(
//                     (tool) => tool.example
//                   ),
//               }));
//             }

//             if (
//               data?.niceToHave?.work_styles ||
//               data?.niceToHave?.interests ||
//               data?.niceToHave?.abilities
//             ) {
//               setResults((prev) => ({
//                 ...prev,
//                 work_styles: [
//                   ...(data?.niceToHave?.work_styles?.map(
//                     (style) => style.name
//                   ) || []),
//                   ...(data?.niceToHave?.interests.map((style) => style.name) ||
//                     []),
//                   ...(data?.niceToHave?.abilities.map((style) => style.name) ||
//                     []),
//                 ],
//               }));
//             }
//           }
//           break;
