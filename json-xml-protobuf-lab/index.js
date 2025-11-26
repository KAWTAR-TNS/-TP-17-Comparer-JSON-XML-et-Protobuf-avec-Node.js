const protobuf = require('protobufjs');
const convert = require('xml-js');
const fs = require('fs');
// Charger la définition Protobuf à partir du fichier .proto
const root = protobuf.loadSync('employee.proto');
// Récupérer le type "Employees" défini dans employee.proto
const EmployeeList = root.lookupType('Employees');
// Création d'une liste d'employés en mémoire
const employees = [];

employees.push({
    id: 1,
    name: 'Ali',
    salary: 9000
});

employees.push({
    id: 2,
    name: 'Kamal',
    salary: 22000
});

employees.push({
    id: 3,
    name: 'Amal',
    salary: 23000
});

// Objet racine correspondant au message "Employees"
let jsonObject = {
    employee: employees
};
// Sérialisation en JSON
let jsonData = JSON.stringify(jsonObject);
// Options pour la conversion JSON -> XML
const options = {
    compact: true,
    ignoreComment: true,
    spaces: 0
};
// Conversion de l'objet JSON en XML
let xmlData = "<root>\n" + convert.json2xml(jsonObject, options) + "\n</root>";
// Encodage en Protobuf : vérification du schéma
let errMsg = EmployeeList.verify(jsonObject);
if (errMsg) {
    throw Error(errMsg);
}
// Création d'un message Protobuf à partir de l'objet JS
let message = EmployeeList.create(jsonObject);

// Encodage en binaire Protobuf
let buffer = EmployeeList.encode(message).finish();
// Écriture des données dans les fichiers
fs.writeFileSync('data.json', jsonData);   // Fichier JSON
fs.writeFileSync('data.xml', xmlData);     // Fichier XML
fs.writeFileSync('data.proto', buffer);    // Fichier Protobuf binaire
// Récupération de la taille des fichiers (en octets)
const jsonFileSize = fs.statSync('data.json').size;
const xmlFileSize = fs.statSync('data.xml').size;
const protoFileSize = fs.statSync('data.proto').size;

// Affichage des tailles dans la console
console.log(`Taille de 'data.json' : ${jsonFileSize} octets`);
console.log(`Taille de 'data.xml'  : ${xmlFileSize} octets`);
console.log(`Taille de 'data.proto': ${protoFileSize} octets`);
// ---------- JSON : encodage ----------
console.time('JSON encode');

console.timeEnd('JSON encode');

// ---------- JSON : décodage ----------
console.time('JSON decode');
let jsonDecoded = JSON.parse(jsonData);
console.timeEnd('JSON decode');
// ---------- XML : encodage ----------
console.time('XML encode');
console.timeEnd('XML encode');

// ---------- XML : décodage ----------
console.time('XML decode');
// Conversion XML -> JSON (texte) -> objet JS
let xmlJson = convert.xml2json(xmlData, { compact: true });
let xmlDecoded = JSON.parse(xmlJson);
console.timeEnd('XML decode');
// ---------- Protobuf : encodage ----------
console.time('Protobuf encode');

console.timeEnd('Protobuf encode');

// ---------- Protobuf : décodage ----------
console.time('Protobuf decode');
let decodedMessage = EmployeeList.decode(buffer);
// Optionnel : conversion vers objet JS "classique"
let protoDecoded = EmployeeList.toObject(decodedMessage);
console.timeEnd('Protobuf decode');