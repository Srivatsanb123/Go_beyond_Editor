'use client'
import React, { useState } from 'react';
import axios from 'axios';
import qs from 'qs';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-gruvbox_dark_hard';
import 'ace-builds/src-noconflict/theme-gruvbox_light_hard';
import 'ace-builds/src-noconflict/theme-dracula';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-github_dark';
import 'ace-builds/src-noconflict/theme-one_dark';
import 'ace-builds/src-noconflict/theme-nord_dark';
import 'ace-builds/src-noconflict/theme-solarized_light';
import 'ace-builds/src-noconflict/theme-cobalt';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-python';
import Question from './components/Question';
import InputOutput from './components/InputOutput';
import Constraints from './components/Constraints';

const themeOptions = [
    { value: 'monokai', label: 'Monokai Theme' },
    { value: 'gruvbox_dark_hard', label: 'Gruvbox Dark Theme' },
    { value: 'gruvbox_light_hard', label: 'Gruvbox Light Theme' },
    { value: 'dracula', label: 'Dracula Theme' },
    { value: 'github_dark', label: 'GitHub Dark Theme' },
    { value: 'github', label: 'GitHub Light Theme' },
    { value: 'one_dark', label: 'One Dark Theme' },
    { value: 'nord_dark', label: 'Nord Dark Theme' },
    { value: 'solarized_light', label: 'Solarized Light Theme' },
    { value: 'cobalt', label: 'Cobalt Theme' },
];

const fontSizeOptions = [
    { value: 10, label: '10px' },
    { value: 12, label: '12px' },
    { value: 14, label: '14px' },
    { value: 16, label: '16px' },
    { value: 18, label: '18px' },
    { value: 20, label: '20px' },
];

const languageOptions = [
    { value: 'python', label: 'Python', mode: 'python' },
    { value: 'javascript', label: 'JavaScript', mode: 'javascript' },
    { value: 'java', label: 'Java', mode: 'java' },
    { value: 'c', label: 'C', mode: 'c_cpp' },
    { value: 'cpp', label: 'C++', mode: 'c_cpp' },
];

export default function Page() {
    const [userCode, setUserCode] = useState('');
    const [userLang, setUserLang] = useState({ value: 'python', label: 'Python', mode: 'python' });
    const [userInput, setUserInput] = useState(new Array(1).fill(''));
    const [userOutput, setUserOutput] = useState([]);
    const [loading, setLoading] = useState(false);
    const [theme, setTheme] = useState('monokai');
    const [fontSize, setFontSize] = useState(16);

    const editorOptions = {
        autoScrollEditorIntoView: true,
        copyWithEmptySelection: true,
        fontSize: fontSize,
    };

    function addTestCase() {
        setUserInput([...userInput, '']);
    }

    function deleteTestCase() {
        if (userInput.length === 1) return;
        const updatedInput = userInput.slice(0, userInput.length - 1);
        setUserInput(updatedInput);
    }

    function handleTestCaseChange(e, index) {
        const updatedInput = [...userInput];
        updatedInput[index] = e.target.value;
        setUserInput(updatedInput);
    }
    const apiURL=process.env.NEXT_PUBLIC_API_URL;
    function runCode() {
        if (userCode === '') return;

        setLoading(true);

        const promises = userInput.map((testCase) => {
            const data = {
                code: userCode,
                language: userLang.label,
                input: testCase,
            };
            const config = {
                method: 'post',
                url: apiURL,
                data: data,
            };
            console.log(process.env);
            return axios(config)
                .then(function (response) {
                    const responseData = response.data;
                    console.log(responseData);
                    return responseData.output;
                })
                .catch(function (error) {
                    console.log('Error executing code:', error);
                    return 'Error executing code.';
                });
        });

        Promise.all(promises)
            .then((results) => {
                setUserOutput(results);
            })
            .catch((error) => {
                console.log('Error executing code:', error);
                setUserOutput(['Error executing code.']);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    function submit() {
        if (userCode === '') return;

        setLoading(true);

        const promises = userInput.map((testCase) => {
            const data = qs.stringify({
                code: userCode,
                language: userLang.label,
                input: testCase,
            });

            const config = {
                method: 'post',
                url: apiURL,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: data,
            };

            return axios(config)
                .then(function (response) {
                    const responseData = response.data;
                    return responseData.output;
                })
                .catch(function (error) {
                    console.log('Error executing code:', error);
                    return 'Error executing code.';
                });
        });

        Promise.all(promises)
            .then((results) => {
                setUserOutput(results);
            })
            .catch((error) => {
                console.log('Error executing code:', error);
                setUserOutput(['Error executing code.']);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <div>
            <header className="flex justify-between items-center px-6 bg-green-600">
                <div className="font-extrabold text-[40px] align-middle">GO BEYOND</div>
                <a href="" className="border-black p-4 border-2 bg-red-500">
                    LOGOUT
                </a>
            </header>
            <div className="flex">
                <div className="flex flex-col w-full p-2">
                    <Question
                        question="Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target..."
                    />
                    <h3 className="font-bold mb-2">Example:</h3>
                    <InputOutput input="nums = [2,7,11,15], target = 9" output="[0,1]" />
                    <h3 className="font-bold mb-2">Constraints:</h3>
                    <Constraints constraints="2 <= nums.length <= 104" />
                </div>
                <div className="flex flex-col w-full p-2">
                    <AceEditor
                        mode={userLang.mode}
                        theme={theme}
                        width="100%"
                        height="500px"
                        value={userCode}
                        onChange={setUserCode}
                        editorProps={{ $blockScrolling: Infinity }}
                        setOptions={editorOptions}
                        showPrintMargin={false}
                    />
                    <div className="inline-flex">
                        <div className="theme-select space-x-4 p-4">
                            <label htmlFor="themeSelect" className="text-gray-700">
                                Select Theme:
                            </label>
                            <select
                                id="themeSelect"
                                value={theme}
                                onChange={(e) => setTheme(e.target.value)}
                                className="rounded-md border-gray-300 shadow-sm focus:ring focus:ring-green-300 focus:border-green-300"
                            >
                                {themeOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="font-size-select space-x-4 p-4">
                            <label htmlFor="fontSizeSelect" className="text-gray-700">
                                Select Font Size:
                            </label>
                            <select
                                id="fontSizeSelect"
                                value={fontSize}
                                onChange={(e) => setFontSize(parseInt(e.target.value))}
                                className="rounded-md border-gray-300 shadow-sm focus:ring focus:ring-green-300 focus:border-green-300"
                            >
                                {fontSizeOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="language-select space-x-4 p-4">
                            <label htmlFor="languageSelect" className="text-gray-700">
                                Select Language:
                            </label>
                            <select
                                id="languageSelect"
                                value={userLang.value}
                                onChange={(e) => {
                                    const selectedValue = e.target.value;
                                    const selectedLanguage = languageOptions.find(
                                        (option) => option.value === selectedValue
                                    );
                                    setUserLang(selectedLanguage);
                                }}
                                className="rounded-md border-gray-300 shadow-sm focus:ring focus:ring-green-300 focus:border-green-300"
                            >
                                {languageOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="bg-slate-400 p-2">
                        <div className="inline-flex justify-end">
                            <div className="bg-red-600 m-2 text-center w-28 rounded">
                                <button onClick={runCode} className="run-button" disabled={loading}>
                                    Run code
                                </button>
                            </div>
                            <div className="bg-green-600 m-2 text-center w-28 rounded">
                                <button onClick={submit} className="submit-button" disabled={loading}>
                                    Submit
                                </button>
                            </div>
                        </div>
                        <h3>Test Cases:</h3>
                        <div className="inline-flex">
                            <div className="add-test-case bg-white m-2 w-fit p-2 text-center rounded">
                                <button onClick={addTestCase} className="add-test-case-button">
                                    Add +
                                </button>
                            </div>
                            <div className="del-test-case bg-white m-2 w-fit p-2 text-center rounded">
                                <button onClick={deleteTestCase} disabled={!userInput || userInput.length === 0}>
                                    Delete -
                                </button>
                            </div>
                        </div>
                        <div className="test-cases m-1">
                            {userInput.map((testCase, index) => (
                                <textarea
                                    key={index}
                                    value={testCase}
                                    onChange={(e) => handleTestCaseChange(e, index)}
                                    className="test-input m-2 resize border rounded-md p-2 focus:outline-none focus:ring focus:border-blue-300"
                                />
                            ))}
                        </div>
                        <h3>Output:</h3>
                        {userOutput.map((output, index) => (
                            <div className="output m-2 text-xl" key={index}>
                                <pre className="bg-black p-2 text-white">{output}</pre>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}