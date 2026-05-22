package com.example.server;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class CourseController {

    private final CourseRepository repo;

    public CourseController(CourseRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/courses")
    public List<CourseEntity> getAll() {
        return repo.findAll();
    }

    @PostMapping("/courses")
    public CourseEntity add(@RequestBody CourseEntity course) {
        return repo.save(course);
    }

    @DeleteMapping("/courses/{id}")
    public Map<String, String> delete(@PathVariable Long id) {
        repo.deleteById(id);
        Map<String, String> res = new HashMap<>();
        res.put("message", "Курс удалён");
        return res;
    }

    @PutMapping("/courses/{id}")
    public CourseEntity update(@PathVariable Long id, @RequestBody CourseEntity updated) {
        return repo.findById(id).map(c -> {
            c.setName(updated.getName());
            c.setTeacher(updated.getTeacher());
            c.setHours(updated.getHours());
            return repo.save(c);
        }).orElseThrow(() -> new RuntimeException("Курс не найден"));
    }
}