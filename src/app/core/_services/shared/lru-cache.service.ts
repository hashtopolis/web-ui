/**
 * Implementation of a LRU Cache with a fixed size
 */

/**
 * Key-value definition of a node in doubbly linked list
 */
class Node<K, V> {
  key: K;
  value: V;
  prev: Node<K, V> | null = null;
  next: Node<K, V> | null = null;

  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
  }
}

/**
 * Implemantinoa of a LRU cache service containing a map and a doubly linked list to avoid lookup performance issues.
 * The map holds the list of keys and the key-value map, the keys are directly linked to the list for fast access.
 * head contains the recently access item, tail the least accessed item, which will be deleted if the capacity is reached
 *
 * Usage:
 * const cacheService = LruCacheService.getInstance();
 * cacheService.set(key, value);
 * const calue = cacheService.get(key);
 */
export class LruCacheService {
  private static instance: LruCacheService;
  private cache: Map<string, Node<string, object>>;
  private readonly capacity: number;
  private head: Node<string, object> | null = null;
  private tail: Node<string, object> | null = null;

  private constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  /**
   * Get singleton instance of the cache
   */
  public static getInstance(): LruCacheService {
    if (!LruCacheService.instance) {
      LruCacheService.instance = new LruCacheService(0);
    }

    return LruCacheService.instance;
  }

  /**
   * Get a node from the cache defined by its key
   * @param key node key to get from cache
   * @returns promise containing the node value or undefined, if key dows not exist
   */
  get(key: string): object | undefined {
    if (!this.cache.has(key)) return undefined;
    const node = this.cache.get(key);
    this.removeNode(node);
    this.insertAtHead(node);
    return node.value;
  }

  /**
   * Insert a new node to the head of the list, remove the tail node (LRU), if capacity is reached
   * @param key key of new node to add
   * @param value value of new node to add
   * @returns empty promise fot thread safety
   */
  set(key: string, value: object): void {
    if (this.cache.has(key)) {
      const existingNode = this.cache.get(key);
      existingNode.value = value;
      this.removeNode(existingNode);
      this.insertAtHead(existingNode);
    } else {
      if (this.capacity > 0 && this.cache.size >= this.capacity) {
        if (this.tail) {
          this.cache.delete(this.tail.key);
          this.removeNode(this.tail);
        }
      }
      const newNode = new Node(key, value);
      this.insertAtHead(newNode);
      this.cache.set(key, newNode);
    }
  }

  /**
   * Clear cache
   */
  clear(): void {
    this.cache.clear();
    this.head = null;
    this.tail = null;
  }

  /**
   * Remove a node from the list
   * @param node node to remove from the list
   * @private
   */
  private removeNode(node: Node<string, object>): void {
    if (node.prev) node.prev.next = node.next;
    if (node.next) node.next.prev = node.prev;

    if (node === this.head) this.head = node.next;
    if (node === this.tail) this.tail = node.prev;

    node.prev = null;
    node.next = null;
  }

  /**
   * Set a new head in the linked list
   * @param node currently access node, move tp head
   * @private
   */
  private insertAtHead(node: Node<string, object>): void {
    if (!this.head) {
      this.head = this.tail = node;
    } else {
      node.next = this.head;
      this.head.prev = node;
      this.head = node;
    }
  }
}
