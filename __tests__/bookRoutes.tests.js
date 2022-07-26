process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("../app");
const db = require("../db");
const Book = require("../models/book");

let testBook;

describe("Book routes tests", () => {
    beforeEach(async () => {
        await db.query(`DELETE FROM books;`)
        testBook = await Book.create({
            isbn: 'testIsbn123',
            amazon_url: 'http://a.co/eobPtX2',
            author: 'test author',
            language: 'english',
            pages: 235,
            publisher: 'test publisher',
            title: 'test book',
            year: 2002
        });
    });

    describe("GET /books", () => {
        test("should return a list containing 1 book", async () => {
            let result = await request(app).get("/books");

            expect(result.status).toBe(200);
            expect(result.body).toEqual({ books: [testBook] });
        });
    });

});

afterAll(async () => {
    await db.end();
})