class Node {
    constructor(value) {
        this.parent = null;
        this.left = null;
        this.right = null;
        this.value = value;
        this.isLeaf = Number.isInteger(value);
    }

    addChild(node) {
        node.parent = this;
        if (!this.left) this.left = node;
        else this.right = node;
    }

    setLeftChild(node) {
        node.parent = this;
        this.left = node;
    }

    setRightChild(node) {
        node.parent = this;
        this.right = node;
    }
}

module.exports = { Node };
