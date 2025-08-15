// Extract first review stage & exception category in one pass
        Map<String, Integer> stageInfo = violations.stream()
                .findFirst()
                .map(vio -> {
                    Map<String, Integer> map = new HashMap<>(2);
                    map.put("reviewStage", vio.getReviewStage());
                    map.put("exceptionCategory", vio.getExceptionCategory());
                    return map;
                })
                .orElseGet(() -> {
                    Map<String, Integer> map = new HashMap<>(2);
                    map.put("reviewStage", DEFAULT_REVIEW_STAGE);
                    map.put("exceptionCategory", null);
                    return map;
                });

        int reviewStage = stageInfo.get("reviewStage");
        Integer exceptionCategory = stageInfo.get("exceptionCategory");

        log.debug("Review stage: {}, Exception category: {}", reviewStage, exceptionCategory);
