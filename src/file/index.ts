import * as fs from 'node:fs';
import { filetypeinfo } from 'magic-bytes.js';

export class File {
    private readonly path: string;

    constructor(path: string) {
        this.path = path;
    }

    isExists(): boolean {
        try {
            fs.accessSync(this.path, fs.constants.F_OK);
            return true;
        } catch (error) { // NOSONAR typescript:S2486
            return false;
        }
    }

    isFile(): boolean {
        try {
            const stats = fs.statSync(this.path);
            return stats.isFile();
        } catch (error) { // NOSONAR typescript:S2486
            // 파일이 존재하지 않거나 접근할 수 없는 경우
            return false;
        }
    }

    isDirectory(): boolean {
        try {
            const stats = fs.statSync(this.path);
            return stats.isDirectory();
        } catch (error) { // NOSONAR typescript:S2486
            // 디렉토리가 존재하지 않거나 접근할 수 없는 경우
            return false;
        }
    }

    getExtension(): string {
        const dotIndex = this.path.indexOf('.');
        if (dotIndex === -1) {
            return '';
        }
        return this.path.substring(dotIndex + 1).toLowerCase();
    }

    getName(removeExtension?: boolean): string {
        const parts = this.path.split('/');
        const fileName = parts.at(-1) ?? '';

        if (removeExtension) {
            const dotIndex = fileName.indexOf('.');
            if (dotIndex === -1) {
                return fileName;
            }
            return fileName.substring(0, dotIndex);
        }

        return fileName;
    }

    getSize(): number {
        try {
            const stats = fs.statSync(this.path);
            return stats.size;
        } catch (error) { // NOSONAR typescript:S2486
            return 0; // 파일이 존재하지 않거나 접근할 수 없는 경우
        }
    }

    getHash(algorithm: 'md5' | 'sha1' | 'sha256'): string {
        try {
            if (!this.isFile()) {
                return "";
            }

            const crypto = require('node:crypto');
            const hash = crypto.createHash(algorithm);
            const fileBuffer = fs.readFileSync(this.path);
            hash.update(fileBuffer);

            return hash.digest('hex');
        } catch (error) { // NOSONAR typescript:S2486
            return "";
        }
    }

    getMimeType(): string {
        try {
            if (!this.isFile()) {
                return "";
            }

            // 파일의 처음 몇 바이트를 읽어서 매직 바이트 분석
            const buffer = fs.readFileSync(this.path);
            const fileInfo = filetypeinfo(buffer);

            if (fileInfo && fileInfo.length > 0) {
                return fileInfo[0].mime ?? "";
            }

            // 매직 바이트로 감지되지 않은 경우, 텍스트 파일인지 확인
            if (this.isTextFile(buffer)) {
                return "text/plain";
            }

            return "application/octet-stream";
        } catch (error) { // NOSONAR typescript:S2486
            return "";
        }
    }

    mkdir(recursive: boolean = false): boolean {
        try {
            if (this.isExists()) {
                return false;
            }
            fs.mkdirSync(this.path, { recursive });

            return true;
        } catch (error) { // NOSONAR typescript:S2486
            return false;
        }
    }

    rm(recursive: boolean = false): boolean {
        try {
            if (this.isDirectory()) {
                fs.rmSync(this.path, { recursive: recursive });
            } else if (this.isFile()) {
                fs.unlinkSync(this.path);
            }

            return true;
        } catch (error) { // NOSONAR typescript:S2486
            return false;
        }
    }

    private isTextFile(buffer: Buffer): boolean {
        // 파일이 비어있으면 텍스트로 간주
        if (buffer.length === 0) {
            return true;
        }

        // 처음 1024바이트 또는 전체 파일 크기 중 작은 것을 검사
        const sampleSize = Math.min(buffer.length, 1024);
        const sample = buffer.subarray(0, sampleSize);

        // NULL 바이트 체크 (가장 확실한 바이너리 지표)
        if (sample.includes(0x00)) {
            return false;
        }

        // null 바이트가 있으면 바이너리 파일로 간주
        for (const element of sample) {
            if (element === 0) {
                return false;
            }
        }

        // UTF-8 BOM 체크
        if (sample[0] === 0xEF && sample[1] === 0xBB && sample[2] === 0xBF) {
            return true;
        }

        // ASCII 범위(0-127) 또는 일반적인 UTF-8 문자가 대부분이면 텍스트로 간주
        let textChars = 0;
        for (const element of sample) {
            const byte = element;
            /*
             * ASCII 제어 문자 중 허용되는 것들: 탭(9), 줄바꿈(10), 캐리지리턴(13)
             * ASCII 범위(32-126)와 UTF-8 확장 문자(128 이상)도 허용
             */
            if ((byte >= 32 && byte <= 126) || byte === 9 || byte === 10 || byte === 13 || byte >= 128) {
                textChars++;
            }
        }

        // 85% 이상이 텍스트 문자이면 텍스트 파일로 간주
        return (textChars / sample.length) >= 0.95;
    }
}
