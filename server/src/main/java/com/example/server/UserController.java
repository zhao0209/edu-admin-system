package com.example.server;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepo;

    public UserController(UserRepository userRepo) {
        this.userRepo = userRepo;
        // 如果数据库中还没有 admin，就创建一个
        if (!userRepo.existsByUsername("admin")) {
            userRepo.save(new UserEntity("admin", "123456", "ADMIN"));
        }
    }

    @PostMapping("/register")
    public Map<String, String> register(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        Map<String, String> response = new HashMap<>();

        if (username == null || username.trim().isEmpty()) {
            response.put("message", "Имя пользователя не может быть пустым");
            return response;
        }
        if (userRepo.existsByUsername(username)) {
            response.put("message", "Пользователь уже существует");
            return response;
        }

        userRepo.save(new UserEntity(username, password, "STUDENT"));
        response.put("message", "Регистрация успешна");
        return response;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        Map<String, Object> response = new HashMap<>();

        Optional<UserEntity> userOpt = userRepo.findByUsername(username);
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            UserEntity user = userOpt.get();
            response.put("success", true);
            response.put("message", "Вход выполнен");
            response.put("role", user.getRole());
            response.put("username", user.getUsername());
        } else {
            response.put("success", false);
            response.put("message", "Неверное имя пользователя или пароль");
        }
        return response;
    }
}