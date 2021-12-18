class Node {
    constructor(value) {
        this.parent = null;
        this.left = null;
        this.right = null;
        this.value = value;
        this.isLeaf = true;
    }

    addChild(node) {
        node.parent = this;
        if (!this.left) this.left = node;
        else this.right = node;
        this.isLeaf = !this.left && !this.right;
    }

    setLeftChild(node) {
        node.parent = this;
        this.left = node;
        this.isLeaf = !this.left && !this.right;
    }

    setRightChild(node) {
        node.parent = this;
        this.right = node;
        this.isLeaf = !this.left && !this.right;
    }

    forEach(callback) {
        const queue = [];
        queue.push(this);
        while (queue.length > 0) {
            const curr = queue.shift();
            if (curr.left) queue.push(curr.left);
            if (curr.right) queue.push(curr.right);
            callback(curr);
        }
    }

    forEachDfs(callback) {
        if (this.left) {
            this.left.forEachDfs(callback);
        }
        if (this.right) {
            this.right.forEachDfs(callback);
        }
        callback(this);
    }

    mapDfs(callback) {
        const result = {
            left: null,
            right: null,
            value: this.isLeaf ? this.value : null,
        };
        if (this.left) {
            result.left = this.left.mapDfs(callback);
        }
        if (this.right) {
            result.right = this.right.mapDfs(callback);
        }
        // return callback({ node: this, isLeaf: this.isLeaf, value: this.value, result });
        return callback({ isLeaf: this.isLeaf, result });
        // console.log(this.value);
        // return callback(this.value);
    }
}

module.exports = { Node };
