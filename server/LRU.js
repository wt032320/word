class DoubleLinkList {
    constructor(key, value) {
        this.key = key || null;
        this.value = value || null;
        this.pre = null;
        this.next = null;
    }
}
class Cache {
    constructor(capcity) {
        this.hNode = new DoubleLinkList();
        this.tNode = new DoubleLinkList();
        this.capcity = capcity;
        this.size = 0;
        this.hashmap = {};
        this.init();
    }
    init() {
        this.hNode.next = this.tNode;
        this.tNode.pre = this.hNode;
    }
    insertIntoHead(node) {
        let hNodeNext = this.hNode.next;
        this.hNode.next = node;
        node.pre = this.hNode;
        node.next = hNodeNext;
        hNodeNext.pre = node;
    }
    push(key, value) {
        if (this.hashmap[key])
            return;
        const node = new DoubleLinkList(key, value);
        if (this.size <= this.capcity - 1) {
            this.insertIntoHead(node);
            this.size++;
        }
        else {
            delete this.hashmap[this.tNode.pre.key];
            this.tNode.pre = this.tNode.pre.pre;
            this.tNode.pre.next = this.tNode;
            this.insertIntoHead(node);
        }
        this.hashmap[key] = node;
    }
    get(key) {
        let goal = this.hashmap[key];
        if (!goal)
            return null;
        let res = goal.value;
        if (goal.pre === this.hNode)
            return goal.value;
        let hNodeNext = this.hNode.next;
        let goalNext = goal.next;
        let goalPre = goal.pre;
        goalPre.next = goalNext;
        goalNext.pre = goalPre;
        goal.pre = this.hNode;
        this.hNode.next = goal;
        goal.next = hNodeNext;
        hNodeNext.pre = goal;
        return res;
    }
}
module.exports = Cache;