const { File } = require('../../dist/index.js');
const path = require('path');

describe('JavaScript Compatibility', () => {
    it('should work with compiled JavaScript', () => {
        const file = new File(path.join(__dirname, '../', 'resources', 'file.txt'));

        expect(file.isExists()).toBe(true);
        expect(file.isFile()).toBe(true);
        expect(file.getName()).toBe('file.txt');
    });
});