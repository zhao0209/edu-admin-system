package com.example.server;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ReportController {

    private final ReportRepository repo;

    public ReportController(ReportRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/reports")
    public List<ReportEntity> getAll() {
        return repo.findAll();
    }

    @PostMapping("/reports")
    public ReportEntity add(@RequestBody ReportEntity report) {
        report.setCreateTime(new Date());
        return repo.save(report);
    }

    @DeleteMapping("/reports/{id}")
    public Map<String, String> delete(@PathVariable Long id) {
        repo.deleteById(id);
        Map<String, String> res = new HashMap<>();
        res.put("message", "报表已删除");
        return res;
    }

    @PutMapping("/reports/{id}")
    public ReportEntity update(@PathVariable Long id, @RequestBody ReportEntity updated) {
        return repo.findById(id).map(r -> {
            r.setName(updated.getName());
            r.setType(updated.getType());
            r.setData(updated.getData());
            return repo.save(r);
        }).orElseThrow(() -> new RuntimeException("报表不存在"));
    }
}