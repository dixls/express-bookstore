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

            expect(result.statusCode).toBe(200);
            expect(result.body).toEqual({ books: [testBook] });
        });
    });
    describe("POST /books", () => {
        test("should return successfully", async () => {
            const successfulTestBook = {
                isbn: 'testIsbn573',
                amazon_url: 'http://a.co/eobPtX2',
                author: 'test author2',
                language: 'French',
                pages: 538,
                publisher: 'test publisher2',
                title: 'test book2',
                year: 2003
            }
            let result = await request(app)
                .post("/books")
                .send(successfulTestBook);
            expect(result.statusCode).toBe(201);
            expect(result.body).toEqual({book: successfulTestBook})
        });
        test("should return an error", async () => {
            const incompleteBook = {
                isbn: 'testIsbn3912',
                amazon_url: 'http://a.co/eobPtX2',
                author: 'test author2',
                language: 'French',
                pages: 538,
                title: 'test book2',
                year: 2003
            }
            let result = await request(app)
                .post("/books")
                .send(incompleteBook);
            expect(result.statusCode).toBe(400);
        })
    })

});

afterAll(async () => {
    await db.end();
})