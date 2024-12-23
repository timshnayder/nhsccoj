const express = require("express");
const cors = require("cors");
const Axios = require("axios");
const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());



app.post("/compile", async (req, res) => {
    let code = req.body.code;
    let language = req.body.language;
    let inputs = req.body.inputs;  // Array of inputs for each test case
    let outputs = req.body.outputs;  // Array of expected outputs for each test case

    let languageMap = {
        "c": { language: "c", version: "10.2.0" },
        "cpp": { language: "c++", version: "10.2.0" },
        "python": { language: "python", version: "3.10.0" },
        "java": { language: "java", version: "15.0.2" }
    };

    if (!languageMap[language]) {
        return res.status(400).send({ error: "Unsupported language" });
    }

    let data = {
        "language": languageMap[language].language,
        "version": languageMap[language].version,
        "files": [
            {
                "name": "main",
                "content": code
            }
        ],
        "stdin": inputs[0]  // We'll handle each test case individually
    };

    let config = {
        method: 'post',
        url: 'https://emkc.org/api/v2/piston/execute',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };
    let verdict = "AC";
    try {
        let results = [];
        

        // Loop through each input/output pair
        for (let i = 0; i < inputs.length; i++) {
            // Set input for the current test case
            data.stdin = inputs[i];

            // Call the API to execute the code
            const response = await Axios(config);

            // Get the result from the API response
            const result = response.data.run;

            // Check if the result matches the expected output
            let status;
            if (result && result.output.trim() === outputs[i]) {
                status = "AC";
            } else if (result && result.output !== outputs[i] && result.output.startsWith("main.cpp")) {
                status = "CE";
                verdict = "CE"
            } else {
                status = "WA";
                verdict = "WA"
            }

            // Push the result for this test case
            results.push({
                input: inputs[i],
                expectedOutput: outputs[i],
                output: result,
                status: status
            });
        }

        // Send the results back to the front end
        // console.log({results,verdict})
        res.json({results,verdict});

    } catch (error) {
        console.log(error);
        res.status(500).send({ error: "Something went wrong" });
    }
});

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});