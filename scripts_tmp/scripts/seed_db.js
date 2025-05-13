"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var db_1 = __importDefault(require("../lib/db"));
var fs = require('fs');
var path = require('path');
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var categoriesPath, productsPath, imagesPath, productCategoriesPath, categories, products, images, productCategories, client, _i, categories_1, cat, _a, products_1, prod, _b, images_1, img, _c, productCategories_1, pc, err_1;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    categoriesPath = path.join(process.cwd(), 'categories.json');
                    productsPath = path.join(process.cwd(), 'products.json');
                    imagesPath = path.join(process.cwd(), 'images.jsonl');
                    productCategoriesPath = path.join(process.cwd(), 'product_categories.json');
                    categories = fs.readFileSync(categoriesPath, 'utf8').split('\n').filter(Boolean).map(function (line) { return JSON.parse(line); });
                    products = fs.readFileSync(productsPath, 'utf8').split('\n').filter(Boolean).map(function (line) { return JSON.parse(line.replace(/\\"/g, '"')); });
                    images = fs.readFileSync(imagesPath, 'utf8').split('\n').filter(Boolean).map(function (line) {
                        try {
                            return JSON.parse(line.replace(/,\s*$/, ''));
                        }
                        catch (e) {
                            console.error('Error parsing image line:', line, e);
                            throw e;
                        }
                    });
                    productCategories = fs.readFileSync(productCategoriesPath, 'utf8').split('\n').filter(Boolean).map(function (line) { return JSON.parse(line); });
                    return [4 /*yield*/, db_1.default.connect()];
                case 1:
                    client = _d.sent();
                    _d.label = 2;
                case 2:
                    _d.trys.push([2, 25, 27, 28]);
                    console.log('Clearing tables...');
                    return [4 /*yield*/, client.query('BEGIN')];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, client.query('DELETE FROM "ProductCategory"')];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, client.query('DELETE FROM "Image"')];
                case 5:
                    _d.sent();
                    return [4 /*yield*/, client.query('DELETE FROM "Product"')];
                case 6:
                    _d.sent();
                    return [4 /*yield*/, client.query('DELETE FROM "Category"')];
                case 7:
                    _d.sent();
                    console.log('Inserting categories...');
                    _i = 0, categories_1 = categories;
                    _d.label = 8;
                case 8:
                    if (!(_i < categories_1.length)) return [3 /*break*/, 11];
                    cat = categories_1[_i];
                    return [4 /*yield*/, client.query('INSERT INTO "Category" (id, slug, name, description, "parentId", "order") VALUES ($1, $2, $3, $4, $5, $6)', [cat.id, cat.slug, cat.name, cat.description, cat.parentId, cat.order])];
                case 9:
                    _d.sent();
                    _d.label = 10;
                case 10:
                    _i++;
                    return [3 /*break*/, 8];
                case 11:
                    console.log('Inserting products...');
                    _a = 0, products_1 = products;
                    _d.label = 12;
                case 12:
                    if (!(_a < products_1.length)) return [3 /*break*/, 15];
                    prod = products_1[_a];
                    return [4 /*yield*/, client.query('INSERT INTO "Product" (id, slug, title, description, price, currency, status, "mainImageId", dimensions, condition, origin, period, featured, "created", "updated") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)', [prod.id, prod.slug, prod.title, prod.description, prod.price, prod.currency, prod.status, prod.mainImageId, prod.dimensions, prod.condition, prod.origin, prod.period, prod.featured, prod.created, prod.updated])];
                case 13:
                    _d.sent();
                    _d.label = 14;
                case 14:
                    _a++;
                    return [3 /*break*/, 12];
                case 15:
                    console.log('Inserting images...');
                    _b = 0, images_1 = images;
                    _d.label = 16;
                case 16:
                    if (!(_b < images_1.length)) return [3 /*break*/, 19];
                    img = images_1[_b];
                    return [4 /*yield*/, client.query('INSERT INTO "Image" (id, url, alt, "productId", "order") VALUES ($1, $2, $3, $4, $5)', [img.id, img.url, img.alt, img.productId, img.order])];
                case 17:
                    _d.sent();
                    _d.label = 18;
                case 18:
                    _b++;
                    return [3 /*break*/, 16];
                case 19:
                    console.log('Inserting product-category relationships...');
                    _c = 0, productCategories_1 = productCategories;
                    _d.label = 20;
                case 20:
                    if (!(_c < productCategories_1.length)) return [3 /*break*/, 23];
                    pc = productCategories_1[_c];
                    return [4 /*yield*/, client.query('INSERT INTO "ProductCategory" ("productId", "categoryId") VALUES ($1, $2)', [pc.productId, pc.categoryId])];
                case 21:
                    _d.sent();
                    _d.label = 22;
                case 22:
                    _c++;
                    return [3 /*break*/, 20];
                case 23: return [4 /*yield*/, client.query('COMMIT')];
                case 24:
                    _d.sent();
                    console.log('Database seeded successfully!');
                    return [3 /*break*/, 28];
                case 25:
                    err_1 = _d.sent();
                    return [4 /*yield*/, client.query('ROLLBACK')];
                case 26:
                    _d.sent();
                    console.error('Error during seeding:', err_1);
                    return [3 /*break*/, 28];
                case 27:
                    client.release();
                    process.exit();
                    return [7 /*endfinally*/];
                case 28: return [2 /*return*/];
            }
        });
    });
}
main();
