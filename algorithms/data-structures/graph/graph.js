const Vertex = require('./vertex');

const core = Symbol('graph-core');

class Graph {
    constructor() {
        this[core] = {};
    }

    addVertex(id, neighbors) {
        const vertex = new Vertex(id, neighbors);
        this[core][id] = vertex;
    }

    vertexes() {
        return this[core];
    }

    edges() {
        const edges = [];
        Object.values(this[core]).forEach(vertex => vertex.edges.forEach(edge => edges.push(edge)));
        return edges;
    }

    depthFirstSearch(start) {
        const vertexes = [],
            visited = [],
            rootId = start ? start : +Object.keys(this[core])[0],
            root = this[core][rootId],
            self = this;

        visited.push(+rootId);
        dfs(root);

        function dfs(vertex) {
            vertex.edges.forEach(edge => {
                if (visited.indexOf(edge.to()) === -1) {
                    visited.push(edge.to());
                    dfs(self[core][edge.to()]);
                }
            });

            vertexes.push(vertex.id);
        }

        return vertexes;
    }

    sortTopological(start) {
        return this.depthFirstSearch(start).reverse();
    }

    shortestPath(start) {
        const distTo = {},
            edgeTo = {},
            topologicalList = this.sortTopological();

        topologicalList.forEach(vertexId => distTo[vertexId] = vertexId === start ? 0 : Infinity);

        const relaxEdge = (edge) => {
            const v = edge.from(),
                w = edge.to();

            if (distTo[w] > distTo[v] + edge.weight()) {
                distTo[w] = distTo[v] + edge.weight();
                edgeTo[w] = edge;
            }
        };

        const relaxVertex = (vertex) => {
            vertex.edges.forEach(edge => relaxEdge(edge));
        };

        topologicalList.forEach(vertexId => relaxVertex(this.vertexes()[vertexId]));

        return {distTo, edgeTo};
    }
}

module.exports = Graph;