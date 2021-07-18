class TNode {
    constructor(isWord) {
        this.isWord = isWord || false;
        this.tChild = new Array(26).fill(null);
    }
}
class Trie {
    static map1 = { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7, i: 8, j: 9, k: 10, l: 11, m: 12, n: 13, o: 14, p: 15, q: 16, r: 17, s: 18, t: 19, u: 20, v: 21, w: 22, x: 23, y: 24, z: 25 }
    static map2 = { 0: 'a', 1: 'b', 2: 'c', 3: 'd', 4: 'e', 5: 'f', 6: 'g', 7: 'h', 8: 'i', 9: 'j', 10: 'k', 11: 'l', 12: 'm', 13: 'n', 14: 'o', 15: 'p', 16: 'q', 17: 'r', 18: 's', 19: 't', 20: 'u', 21: 'v', 22: 'w', 23: 'x', 24: 'y', 25: 'z' }
    constructor() {
        this.root = new TNode();
        this.size = 0;
    }
    insert(word) {
        let chs = word.split("");
        function helper1(i, node) {
            let nodeChild = node.tChild[Trie.map1[chs[i]]];
            if (i === chs.length - 1) {
                if (!nodeChild)
                    node.tChild[Trie.map1[chs[i]]] = new TNode(true);
                else
                    nodeChild.isWord = true;
                return;

            }
            else {
                if (!nodeChild) {
                    let nNode = new TNode();
                    node.tChild[Trie.map1[chs[i]]] = nNode;
                    helper1(i + 1, nNode);
                }
                else
                    helper1(i + 1, nodeChild);
            }
        }
        helper1(0, this.root);
        this.size++;
    }
    guessWord(subword) {
        let res = [];
        let root = this.root;
        for (let ch of subword) {
            root = root.tChild[Trie.map1[ch]];
            if (!root)
                return res;
        }
        function helper(root, temp) {
            if (root.isWord) {
                res.push(subword + temp);
            }
            let i = 0;
            let len = root.tChild.length;
            for (; i < len; i++) {
                if (root.tChild[i]) {
                    temp += Trie.map2[i];
                    helper(root.tChild[i], temp);
                    temp = temp.substr(0, temp.length - 1);
                }
            }
        }
        helper(root, "");
        return res;
    }
}
module.exports = Trie;