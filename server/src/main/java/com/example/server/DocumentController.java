package com.example.server;

import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class DocumentController {

    private final List<Map<String, Object>> docs = new CopyOnWriteArrayList<>();
    private int nextId = 1;

    public DocumentController() {
        docs.add(createDoc("Приказ №1", "О зачислении студентов", "утверждён"));
        docs.add(createDoc("Распоряжение №2", "Об изменении расписания", "на согласовании"));
        nextId = 3;
    }

    private Map<String, Object> createDoc(String title, String content, String status) {
        Map<String, Object> doc = new HashMap<>();
        doc.put("id", nextId++);
        doc.put("title", title);
        doc.put("content", content);
        doc.put("status", status);
        return doc;
    }

    @GetMapping("/documents")
    public List<Map<String, Object>> getAll() {
        return docs;
    }

    @PostMapping("/documents")
    public Map<String, Object> add(@RequestBody Map<String, Object> newDoc) {
        newDoc.put("id", nextId++);
        docs.add(newDoc);
        return newDoc;
    }

    @DeleteMapping("/documents/{id}")
    public Map<String, String> delete(@PathVariable int id) {
        docs.removeIf(d -> Integer.parseInt(d.get("id").toString()) == id);
        Map<String, String> res = new HashMap<>();
        res.put("message", "Документ удалён");
        return res;
    }

    @PutMapping("/documents/{id}")
    public Map<String, Object> update(@PathVariable int id, @RequestBody Map<String, Object> updated) {
        for (Map<String, Object> doc : docs) {
            if (Integer.parseInt(doc.get("id").toString()) == id) {
                doc.put("title", updated.get("title"));
                doc.put("content", updated.get("content"));
                doc.put("status", updated.get("status"));
                return doc;
            }
        }
        return null;
    }

    // 待审批文档数量（管理员首页用）
    @GetMapping("/documents/pending-count")
    public Map<String, Object> getPendingCount() {
        long count = docs.stream()
                .filter(d -> "на согласовании".equals(d.get("status")))
                .count();
        Map<String, Object> result = new HashMap<>();
        result.put("count", count);
        return result;
    }

    // 🆕 学生首页：获取已批准的文档（公告）
    @GetMapping("/documents/approved")
    public List<Map<String, Object>> getApproved() {
        return docs.stream()
                .filter(d -> "утверждён".equals(d.get("status")))
                .collect(Collectors.toList());
    }
}