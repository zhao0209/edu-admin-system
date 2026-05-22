package com.example.server;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class StudentController {

    private final StudentRepository repo;

    public StudentController(StudentRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/students")
    public List<StudentEntity> getAll() {
        return repo.findAll();
    }

    @PostMapping("/students")
    public StudentEntity add(@RequestBody StudentEntity student) {
        return repo.save(student);
    }

    @DeleteMapping("/students/{id}")
    public Map<String, String> delete(@PathVariable Long id) {
        repo.deleteById(id);
        Map<String, String> res = new HashMap<>();
        res.put("message", "Сотрудник удалён");
        return res;
    }

    @PutMapping("/students/{id}")
    public StudentEntity update(@PathVariable Long id, @RequestBody StudentEntity updated) {
        return repo.findById(id).map(s -> {
            s.setName(updated.getName());
            s.setEmail(updated.getEmail());
            s.setPosition(updated.getPosition());
            s.setLocation(updated.getLocation());
            return repo.save(s);
        }).orElseThrow(() -> new RuntimeException("Сотрудник не найден"));
    }
}