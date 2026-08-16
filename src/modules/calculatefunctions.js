import bcrypt from "bcryptjs";
import axios from "axios";
export const comparePassword = (userPassword, serverPassword) => {
  let match = bcrypt.compareSync(userPassword, serverPassword);

  return match;
};
export const encryptPassword = async (password) =>
  await bcrypt.hashSync(password, 10);
export function round2dec(value) {
  if (value % 1 !== 0) {
    return Number(Math.round(value + "e" + 2) + "e-" + 2).toFixed(2);
  } else {
    return value;
  }
}
import { collection, deleteDoc, getDocs, query } from "firebase/firestore";
import { firestore } from "../lib/firebase";
export const deleteCollection = async (dbName) => {
  try {
    const q = query(collection(firestore, dbName));

    const querySnapshot = await getDocs(q);

    // Delete each document
    querySnapshot.docs.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
    console.log("Collection successfully deleted!");
  } catch (error) {
    console.error("Error deleting collection: ", error);
  }
};

export function NumInWords(number) {
  const first = [
    "",
    "one ",
    "two ",
    "three ",
    "four ",
    "five ",
    "six ",
    "seven ",
    "eight ",
    "nine ",
    "ten ",
    "eleven ",
    "twelve ",
    "thirteen ",
    "fourteen ",
    "fifteen ",
    "sixteen ",
    "seventeen ",
    "eighteen ",
    "nineteen ",
  ];
  const tens = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];
  const mad = ["", "thousand", "million", "billion", "trillion"];
  let word = "";

  for (let i = 0; i < mad.length; i++) {
    let tempNumber = number % (100 * Math.pow(1000, i));
    if (Math.floor(tempNumber / Math.pow(1000, i)) !== 0) {
      if (Math.floor(tempNumber / Math.pow(1000, i)) < 20) {
        word = titleCase(
          first[Math.floor(tempNumber / Math.pow(1000, i))] +
            mad[i] +
            " " +
            word,
        );
      } else {
        word = titleCase(
          tens[Math.floor(tempNumber / (10 * Math.pow(1000, i)))] +
            " " +
            first[Math.floor(tempNumber / Math.pow(1000, i)) % 10] +
            mad[i] +
            " " +
            word,
        );
      }
    }

    tempNumber = number % Math.pow(1000, i + 1);
    if (Math.floor(tempNumber / (100 * Math.pow(1000, i))) !== 0)
      word = titleCase(
        first[Math.floor(tempNumber / (100 * Math.pow(1000, i)))] +
          "hunderd " +
          word,
      );
  }
  return word;
}

export function titleCase(str) {
  if (str) {
    str = str.toLowerCase().split(" ");
    for (var i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(" ");
  } else {
    return "";
  }
}

export function percentTotal(value) {
  if (value >= 90) {
    return "A+";
  } else if (value >= 80) {
    return "A";
  } else if (value >= 70) {
    return "B+";
  } else if (value >= 60) {
    return "B";
  } else if (value >= 45) {
    return "C+";
  } else if (value >= 25) {
    return "C";
  } else {
    return "D";
  }
}

export const ptaxCalc = (gross) => {
  if (gross > 40000) {
    return 200;
  } else if (gross > 25000) {
    return 150;
  } else if (gross > 15000) {
    return 130;
  } else if (gross > 10000) {
    return 110;
  } else {
    return 0;
  }
};

export function findEmptyValues(obj) {
  const emptyValues = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (
        value === null ||
        value === undefined ||
        value === "" ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === "object" && Object.keys(value).length === 0)
      ) {
        emptyValues[key] = value;
      }
    }
  }

  return emptyValues;
}

function isEmpty(value) {
  return (
    value === null ||
    value === undefined ||
    value === "" ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === "object" && Object.keys(value).length === 0)
  );
}

export function validateEmptyValues(obj) {
  const emptyFields = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (isEmpty(obj[key])) {
        emptyFields[key] = "Field is empty";
      }
    }
  }

  return emptyFields;
}

export function roundSo(number, to) {
  return Math.round(number / to, 0) * to;
}
export function randBetween(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const RoundTo = (number, multiple) => {
  // Calculate the remainder when number is divided by multiple
  var remainder = number % multiple;

  // If remainder is less than half of multiple, round down
  // Otherwise, round up
  if (remainder < multiple / 2) {
    return number - remainder;
  } else {
    return number + multiple - remainder;
  }
};

export function GetMonthName(monthNumber) {
  monthNumber = monthNumber < 0 ? 11 : monthNumber;
  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[monthNumber];
}

export function printDate() {
  const date = new Date();
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  const nthNumber = (number) => {
    return number > 0
      ? ["th", "st", "nd", "rd"][
          (number > 3 && number < 21) || number % 10 > 3 ? 0 : number % 10
        ]
      : "";
  };

  return `${day}${nthNumber(day)} of ${month}, ${year}`;
}
export const getCurrentDateInput = (date) => {
  if (date) {
    let data = date.split("-");
    let day = data[0];
    let month = data[1];
    let year = data[2];
    return `${year}-${month}-${day}`;
  }
};
export const getSubmitDateInput = (date) => {
  if (date) {
    let data = date.split("-");
    let day = data[2];
    let month = data[1];
    let year = data[0];
    return `${day}-${month}-${year}`;
  }
};
export const getSubmitDateSlashInput = (date) => {
  if (date) {
    let data = date.split("/");
    let day = data[1];
    let month = data[0];
    let year = data[2];
    if (parseInt(day) < 10) {
      day = "0" + day;
    }
    if (parseInt(month) < 10) {
      month = "0" + month;
    }
    return `${year}-${month}-${day}`;
  }
};

export const todayInString = () => {
  const date = new Date();
  let day = date.getDate();
  if (day < 10) {
    day = "0" + day;
  }
  let month = date.getMonth() + 1;
  if (month < 10) {
    month = "0" + month;
  }
  let year = date.getFullYear();
  return `${day}-${month}-${year}`;
};
export function dateStringToDateObj(date) {
  if (date) {
    let data = date.split("-");
    let day = data[0];
    let month = parseInt(data[1]) - 1;
    let year = data[2];
    return new Date(year, month, day);
  }
}
export function dateObjToDateFormat(date) {
  if (!date) return "";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}
export const IndianFormat = (x) => {
  if (x !== undefined) {
    x = x.toString();
    var afterPoint = "";
    if (x.indexOf(".") > 0) afterPoint = x.substring(x.indexOf("."), x.length);
    x = Math.floor(x);
    x = x.toString();
    var lastThree = x.substring(x.length - 3);
    var otherNumbers = x.substring(0, x.length - 3);
    if (otherNumbers !== "") lastThree = "," + lastThree;
    return (
      otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
      lastThree +
      afterPoint
    );
  } else return;
};

export function INR(input) {
  const rupees = Number(parseInt(input, 10));
  const output = [];

  if (rupees === 0) {
    output.push("zero");
  } else if (rupees === 1) {
    output.push("one");
  } else {
    const crores = Math.floor(rupees / 10000000) % 100;
    if (crores > 0) {
      output.push(`${getHundreds(crores)} Crore`);
    }

    const lakhs = Math.floor(rupees / 100000) % 100;
    if (lakhs > 0) {
      output.push(`${getHundreds(lakhs)} Lakh`);
    }

    const thousands = Math.floor(rupees / 1000) % 100;
    if (thousands > 0) {
      output.push(`${getHundreds(thousands)} Thousand`);
    }

    const hundreds = Math.floor((rupees % 1000) / 100);
    if (hundreds > 0 && hundreds < 10) {
      output.push(`${getOnes(hundreds)} Hundred`);
    }

    const tens = rupees % 100;
    if (tens > 0) {
      if (rupees > 100) output.push("and");
      output.push(`${getHundreds(tens)}`);
    }
  }

  return ["Rupees", ...output, "only"]
    .join(" ")
    .split(/\s/)
    .filter((e) => e)
    .map((e) => e.substr(0, 1) + e.substr(1))
    .join(" ");
}

function getOnes(number) {
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];
  return ones[number] || "";
}

function getTeens(number) {
  const teens = [
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  return teens[number] || "";
}

function getTens(number) {
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  return tens[number] || "";
}

function getHundreds(num) {
  if (num > 0 && num < 10) {
    return getOnes(num);
  }
  if (num >= 10 && num < 20) {
    return getTeens(num % 10);
  }
  if (num >= 20 && num < 100) {
    return `${getTens(Math.floor(num / 10))}${
      getOnes(num % 10) !== "" ? "-" : " "
    }${getOnes(num % 10)}`;
  }
  return "";
}

export const calculateRetirementDate = (joiningDate) => {
  const joinedYear = parseInt(joiningDate.substring(0, 4), 10);
  const joinedMonth = parseInt(joiningDate.substring(5, 7), 10);
  const currentYear = new Date().getFullYear();
  const retirementYear = joinedYear + 60;

  let retirementMonth = joinedMonth;
  let retirementDay = new Date(retirementYear, retirementMonth, 0).getDate();

  if (currentYear >= retirementYear) {
    retirementMonth = 12;
    retirementDay = new Date(retirementYear, retirementMonth, 0).getDate();
  }

  if (new Date(joiningDate).getDate() === 1) {
    return `${retirementDay.toString().padStart(2, "0")}-${(retirementMonth - 1)
      .toString()
      .padStart(2, "0")}-${retirementYear}`;
  } else {
    return `${retirementDay.toString().padStart(2, "0")}-${retirementMonth
      .toString()
      .padStart(2, "0")}-${retirementYear}`;
  }
};

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export const finMonths = [
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
  "January",
  "February",
  "March",
];
export const getMonthDays = [31, 30, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
export const generateID = () => {
  const capitalAlphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";

  let randomCode = "";

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * capitalAlphabets.length);
    randomCode += capitalAlphabets[randomIndex];
  }

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * numbers.length);
    randomCode += numbers[randomIndex];
  }

  return randomCode;
};
export const validateEmployeeID = (id) => {
  const pattern = /^[A-Z]{4}\d{4}$/;
  return pattern.test(id.toUpperCase());
};
export function compareObjects(x, y) {
  if (x === y) return true;
  // if both x and y are null or undefined and exactly the same

  if (!(x instanceof Object) || !(y instanceof Object)) return false;
  // if they are not strictly equal, they both need to be Objects

  if (x.constructor !== y.constructor) return false;
  // they must have the exact same prototype chain, the closest we can do is
  // test there constructor.

  for (var p in x) {
    if (!x.hasOwnProperty(p)) continue;
    // other properties were tested using x.constructor === y.constructor

    if (!y.hasOwnProperty(p)) return false;
    // allows to compare x[ p ] and y[ p ] when set to undefined

    if (x[p] === y[p]) continue;
    // if they have the same strict value or identity then they are equal

    if (typeof x[p] !== "object") return false;
    // Numbers, Strings, Functions, Booleans must be strictly equal

    if (!compareObjects(x[p], y[p])) return false;
    // Objects and Arrays must be tested recursively
  }

  for (p in y) if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) return false;
  // allows x[ p ] to be set to undefined

  return true;
}
export const enToBnNumber = (n) =>
  n.toString().replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);
export const DateValueToString = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(Number(timestamp)); // ensure numeric timestamp

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // 0 -> 12, 13–23 -> 1–11
  const formattedHours = hours.toString().padStart(2, "0");

  return `${day}-${month}-${year} at ${formattedHours}:${minutes}:${seconds} ${ampm}`;
};
export const generateRandomPAN = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  // Valid 4th characters for type of holder
  const panTypes = "PCHFATBLJG";

  function getRandomChar(str) {
    return str.charAt(Math.floor(Math.random() * str.length));
  }

  let pan = "";

  // First three characters: random letters
  for (let i = 0; i < 3; i++) {
    pan += getRandomChar(letters);
  }

  // Fourth character: type of holder (e.g., 'P' for Personal)
  pan += getRandomChar(panTypes);

  // Fifth character: random letter
  pan += getRandomChar(letters);

  // Next four characters: random numbers
  for (let i = 0; i < 4; i++) {
    pan += getRandomChar(numbers);
  }

  // Last character: random letter
  pan += getRandomChar(letters);

  return pan;
};
export const generateRandomUDISE = () => {
  // Generate a random number between 0 and 9999999
  const randomNumber = Math.floor(Math.random() * 10000000);
  // Pad with leading zeros to ensure a 7-digit string
  const paddedNumber = String(randomNumber).padStart(7, "0");
  return `1916${paddedNumber}`;
};
export function removeDuplicates(books) {
  // Create an array of objects

  // Declare a new array
  let newArray = [];

  // Declare an empty object
  let uniqueObject = {};
  let objTitle;
  // Loop for the array elements
  for (let i in books) {
    // Extract the title
    objTitle = books[i]["id"];

    // Use the title as the index
    uniqueObject[objTitle] = books[i];
  }

  // Loop to push unique object into array
  for (let i in uniqueObject) {
    newArray.push(uniqueObject[i]);
  }

  // Display the unique objects
  return newArray;
}
export function removeDuplicateValues(books) {
  // Create an array of objects

  // Declare a new array
  let newArray = [];

  // Declare an empty object
  let uniqueObject = {};
  let objTitle;
  // Loop for the array elements
  for (let i in books) {
    // Extract the title
    objTitle = books[i]["value"];

    // Use the title as the index
    uniqueObject[objTitle] = books[i];
  }

  // Loop to push unique object into array
  for (let i in uniqueObject) {
    newArray.push(uniqueObject[i]);
  }

  // Display the unique objects
  return newArray;
}
export function uniq(a) {
  return a.sort().filter(function (item, pos, ary) {
    return !pos || item !== ary[pos - 1];
  });
}

// Function to retrieve values from second array using keys from the first array
export const getValues = (firstArray, secondArray, sl) => {
  return secondArray.map((obj, index) => {
    return (
      <tr className="text-center" key={index}>
        <td className="text-center">{sl + index + 1}</td>
        {firstArray.map((key, i) => (
          <td className="text-center" key={i}>
            {obj.hasOwnProperty(key) ? obj[key] : null}
          </td>
        ))}
      </tr>
    );
  });
};

export const getServiceAge = (date) => {
  if (!date) return "";
  let currentDate = Date.now();
  let birthDate = Date.parse(getCurrentDateInput(date));
  let yearInMillis = 31556926000;
  let age = Math.floor((currentDate - birthDate) / yearInMillis);
  return age;
};
export const getServiceLife = (date) => {
  if (!date) return "";
  let currentDate = Date.now();
  let birthDate = Date.parse(getCurrentDateInput(date));
  let yearInMillis = 31556926000;
  let monthinMillis = 2629800000;
  let age = Math.floor((currentDate - birthDate) / yearInMillis);
  let months = Math.floor(
    ((currentDate - birthDate) % yearInMillis) / monthinMillis,
  );
  if (age) {
    return `${age} years ${months} months`;
  } else {
    return `${months} months`;
  }
};
export const filterArrayExtraItems = (x, y) => {
  return x.filter((item) => !y.includes(item));
};
export const filterArraySameItems = (x, y) => {
  return x.filter((item) => y.includes(item));
};
export const uniqArray = (a) => [...new Set(a)];
export const monthNamesWithIndex = [
  { monthName: "January", index: "01", rank: 1 },
  { monthName: "February", index: "02", rank: 2 },
  { monthName: "March", index: "03", rank: 3 },
  { monthName: "April", index: "04", rank: 4 },
  { monthName: "May", index: "05", rank: 5 },
  { monthName: "June", index: "06", rank: 6 },
  { monthName: "July", index: "07", rank: 7 },
  { monthName: "August", index: "08", rank: 8 },
  { monthName: "September", index: "09", rank: 9 },
  { monthName: "October", index: "10", rank: 10 },
  { monthName: "November", index: "11", rank: 11 },
  { monthName: "December", index: "12", rank: 12 },
];

export const createDownloadLink = (myData, fileName) => {
  const json = JSON.stringify(myData, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const href = URL.createObjectURL(blob);

  // create "a" HTLM element with href to file
  const link = document.createElement("a");
  link.href = href;
  link.download = fileName + ".json";
  document.body.appendChild(link);
  link.click();

  // clean up "a" element & remove ObjectURL
  document.body.removeChild(link);
  URL.revokeObjectURL(href);
};
export function round5(x) {
  return Math.ceil(x / 5) * 5;
}

export const setInputNumberMaxLength = (value, maxLength) => {
  if (value) {
    if (value.length > maxLength) {
      return value.slice(0, maxLength);
    } else {
      return value;
    }
  }
};

export const btnArray = [
  { label: "Add", color: "success" },
  { label: "Edit", color: "warning" },
  { label: "Delete", color: "danger" },
  { label: "View", color: "info" },
  { label: "Print", color: "primary" },
  { label: "Export", color: "dark" },
  { label: "Import", color: "light" },
  { label: "Save", color: "secondary" },
  { label: "Reset", color: "light" },
  { label: "Search", color: "info" },
  { label: "Refresh", color: "warning" },
  { label: "Download", color: "primary" },
  { label: "Upload", color: "success" },
  { label: "Send", color: "info" },
  { label: "Receive", color: "warning" },
  { label: "Forward", color: "danger" },
];

export const sortMonthwise = (arr) => {
  return arr.sort((a, b) => {
    // Assuming 'month' is the key in the object which contains the month name
    const monthA = months.indexOf(a.month);
    const monthB = months.indexOf(b.month);

    return monthA - monthB;
  });
};
export function getFilenameWithoutExtension(filename) {
  const lastDotIndex = filename.lastIndexOf(".");
  if (lastDotIndex === -1) {
    return filename; // No extension found
  }
  return filename.substring(0, lastDotIndex);
}
export const sliceArrayIntoChunks = (array, maxChunkSize) => {
  // If array length is 24 or less, return it as a single chunk
  if (array.length <= maxChunkSize) {
    return [array];
  }

  const result = [];
  const numberOfChunks = Math.ceil(array.length / maxChunkSize);

  for (let i = 0; i < numberOfChunks; i++) {
    const startIndex = i * maxChunkSize;
    const endIndex = startIndex + maxChunkSize;
    const chunk = array.slice(startIndex, endIndex);
    result.push(chunk);
  }

  return result;
};
export function formatDate(date) {
  if (!date) return "";

  const parts = String(date).split("-");

  if (parts.length !== 3) return date;

  const [year, month, day] = parts;

  return `${day}-${month}-${year}`;
}
