List<Map<String, Object>> result = windowDetailList.stream()
        .map(wd -> {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("hostname", wd.getHostName());
            map.put("network", wd.getNetwork());
            map.put("gbgf", wd.getGbgf());
            map.put("gbgfFunction", wd.getGbgfFunction());
            map.put("gbgfSubFunction", wd.getGbgfSubFunction());
            map.put("itso", wd.getItso());
            return map;
        })
        .collect(Collectors.toList());


List<Map<String, Object>> result = unixDetailList.stream()
        .map(detail -> {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("hostname", detail.getHostname());
            map.put("network", detail.getNetwork());
            map.put("country", detail.getCountry());
            map.put("gbgf", detail.getGbgf());
            map.put("gbgfFunction", detail.getGbgfFunction());
            map.put("gbgfSubFunction", detail.getGbgfSubFunction());
            map.put("environment", detail.getEnvironment());
            map.put("itso", detail.getItso());
            return map;
        })
        .collect(Collectors.toList());
