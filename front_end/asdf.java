public List<Integer> topKFrequent(int[] nums, int k) {
    List<Integer>[] bucket = new ArrayList[nums.length + 1];

    Map<Integer, Integer> frequencyMap = new HashMap<Integer, Integer>();

    for (int n : nums) {
        frequencyMap.put(n, frequencyMap.getOrDefault(n, 0) + 1);
    }

    for (int key : frequencyMap.keySet()) {
        int frequency = frequencyMap.get(key);
        if (bucket[frequency] == null) 
            bucket[frequency] = new ArrayList<>();
        
        bucket[frequency].add(key);
    }

    List<Integer> res = new ArrayList<>();

    for (int bucketDex = bucket.length - 1; bucketDex >= 0; bucketDex--) {
        if (res.size() == k)
            break;

        if (bucket[bucketDex] != null) {
            res.addAll(bucket[pos]);
        }
    }
    return res;
}