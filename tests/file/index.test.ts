import { File } from '../../src';
import * as path from 'path';
import fs from "fs";

const filePath = path.join(__dirname, '..', 'resources', 'file');
const directoryPath = path.join(__dirname, '..', 'resources', 'directory');
const nonExistentPath = path.join(__dirname, '..', 'resources', 'nonexistent');

describe('File', () => {
    describe('isFile and isDirectory methods', () => {
        it('should correctly identify a file', () => {
            const file = new File(filePath);

            expect(file.isFile()).toBe(true);
            expect(file.isDirectory()).toBe(false);
        });

        it('should correctly identify a directory', () => {
            const directory = new File(directoryPath);

            expect(directory.isFile()).toBe(false);
            expect(directory.isDirectory()).toBe(true);
        });

        it('should return false for non-existent paths', () => {
            const nonExistent = new File(nonExistentPath);

            expect(nonExistent.isFile()).toBe(false);
            expect(nonExistent.isDirectory()).toBe(false);
        });
    });

    describe("isExists method", () => {
        it("src/resources/directory is exists", () => {
            const file = new File(filePath);
            const directory = new File(directoryPath);

            expect(file.isExists()).toBe(true);
            expect(directory.isExists()).toBe(true);
        });

        it("src/resources/directory/file is not exists", () => {
            const file = new File(nonExistentPath);

            expect(file.isExists()).toBe(false);
        })
    });

    describe("getExtension method", () => {
        it("should return the correct file extension", () => {
            const file = new File(path.join(__dirname, '..', 'resources', 'file.txt'));
            expect(file.getExtension()).toBe('txt');
        });

        it("should return an empty string for files without an extension", () => {
            const noExtFile = new File(path.join(__dirname, '..', 'resources', 'file.tar.gz'));
            expect(noExtFile.getExtension()).toBe('tar.gz');
        });
    });

    describe("getName method", () => {
        it("should return the correct file name", () => {
            const file = new File(path.join(__dirname, '..', 'resources', 'file.txt'));

            expect(file.getName()).toBe('file.txt');
            expect(file.getName(false)).toBe('file.txt');
            expect(file.getName(true)).toBe('file');
        })

        it("should return the correct file name", () => {
            const noExtFile = new File(path.join(__dirname, '..', 'resources', 'file.tar.gz'));

            expect(noExtFile.getName()).toBe('file.tar.gz');
            expect(noExtFile.getName(false)).toBe('file.tar.gz');
            expect(noExtFile.getName(true)).toBe('file');
        })
    });

    describe('getMimeType method', () => {
        it('should return correct MIME type for text file', async () => {
            const filePath = path.join(__dirname, '..', 'resources', 'file.txt');
            const file = new File(filePath);

            const mimeType = file.getMimeType();
            expect(mimeType).toBe('text/plain');
        });

        it('should return correct MIME type for tar.gz file', async () => {
            const filePath = path.join(__dirname, '..', 'resources', 'file.tar.gz');
            const file = new File(filePath);

            const mimeType = file.getMimeType();
            expect(mimeType).toBe('application/gzip');
        });

        it('should return null for directory', async () => {
            const directoryPath = path.join(__dirname, '..', 'resources', 'directory');
            const directory = new File(directoryPath);

            const mimeType = directory.getMimeType();
            expect(mimeType).toBe("");
        });

        it('should return null for non-existent file', async () => {
            const nonExistentPath = path.join(__dirname, '..', 'resources', 'nonexistent');
            const nonExistent = new File(nonExistentPath);

            const mimeType = nonExistent.getMimeType();
            expect(mimeType).toBe("");
        });
    });

    describe('getSize method', () => {
        it('should return the correct file size', () => {
            const file = new File(filePath);
            const size = file.getSize();

            expect(size).toBe(13);
        });

        it('should return 0 for non-existent file', () => {
            const nonExistent = new File(nonExistentPath);
            const size = nonExistent.getSize();

            expect(size).toBe(0); // 파일이 존재하지 않으면 크기는 0이어야 함
        });
    });

    describe("getHash method", () => {
        const crypto = require('crypto');

        it("should return the correct MD5 hash for a file", () => {
            const file = new File(path.join(__dirname, '..', 'resources', 'file.txt'));
            const hash = file.getHash('md5');

            const hash2 = crypto.createHash("md5");
            const fileBuffer = fs.readFileSync(path.join(__dirname, '..', 'resources', 'file.txt'));
            hash2.update(fileBuffer);

            expect(hash).toBe(hash2.digest('hex')); // 예시 해시 값
        });

        it("should return the correct SHA1 hash for a file", () => {
            const file = new File(path.join(__dirname, '..', 'resources', 'file.txt'));
            const hash = file.getHash('sha1');

            const hash2 = crypto.createHash("sha1");
            const fileBuffer = fs.readFileSync(path.join(__dirname, '..', 'resources', 'file.txt'));
            hash2.update(fileBuffer);

            expect(hash).toBe(hash2.digest('hex')); // 예시 해시 값
        });

        it("should return the correct SHA256 hash for a file", () => {
            const file = new File(path.join(__dirname, '..', 'resources', 'file.txt'));
            const hash = file.getHash('sha256');

            const hash2 = crypto.createHash("sha256");
            const fileBuffer = fs.readFileSync(path.join(__dirname, '..', 'resources', 'file.txt'));
            hash2.update(fileBuffer);

            expect(hash).toBe(hash2.digest('hex')); // 예시 해시 값
        });

        it("should return an empty string for non-existent files", () => {
            const nonExistent = new File(nonExistentPath);
            const hash = nonExistent.getHash('md5');

            expect(hash).toBe('');
        });
    });
});
