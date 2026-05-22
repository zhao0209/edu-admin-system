package com.example.server;

import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class LeaveRequestController {

    private final List<Map<String, Object>> leaves = new CopyOnWriteArrayList<>();
    private int nextId = 1;

    // 初始示例请假记录（可选）
    public LeaveRequestController() {
        Map<String, Object> l1 = new HashMap<>();
        l1.put("id", nextId++);
        l1.put("student", "Чжан Цзиньчжао");
        l1.put("course", "Распределенные программные системы");
        l1.put("date", "2026-05-06");
        l1.put("reason", "Болезнь");
        l1.put("status", "на рассмотрении"); // статус: на рассмотрении, одобрено, отклонено
        leaves.add(l1);
    }

    @GetMapping("/leaves")
    public List<Map<String, Object>> getAll() {
        return leaves;
    }

    @PostMapping("/leaves")
    public Map<String, Object> add(@RequestBody Map<String, Object> newLeave) {
        newLeave.put("id", nextId++);
        newLeave.put("status", "на рассмотрении"); // 新提交默认待审批
        leaves.add(newLeave);
        return newLeave;
    }

    // 管理员审批：批准或拒绝
    @PutMapping("/leaves/{id}")
    public Map<String, Object> updateStatus(@PathVariable int id, @RequestBody Map<String, Object> body) {
        String action = (String) body.get("action"); // одобрить / отклонить
        for (Map<String, Object> leave : leaves) {
            if (Integer.parseInt(leave.get("id").toString()) == id) {
                if ("одобрить".equals(action)) {
                    leave.put("status", "одобрено");
                } else if ("отклонить".equals(action)) {
                    leave.put("status", "отклонено");
                }
                return leave;
            }
        }
        return null;
    }

    @DeleteMapping("/leaves/{id}")
    public Map<String, String> delete(@PathVariable int id) {
        leaves.removeIf(l -> Integer.parseInt(l.get("id").toString()) == id);
        Map<String, String> res = new HashMap<>();
        res.put("message", "Удалено");
        return res;
    }
}