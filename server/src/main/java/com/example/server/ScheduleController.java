package com.example.server;

import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ScheduleController {

    private final List<Map<String, Object>> schedules = new CopyOnWriteArrayList<>();
    private int nextId = 1;

    public ScheduleController() {
        schedules.add(createSchedule("Распределенные программные системы", "понедельник", "18:00 - 21:00", "Аудитория 301", "Иванов И.И."));
        schedules.add(createSchedule("Веб-дизайн", "вторник", "18:00 - 21:00", "Компьютерный класс 105", "Петров П.П."));
        schedules.add(createSchedule("Тестирование ПО", "среда", "18:00 - 21:00", "Лаборатория 202", "Сидоров С.С."));
        schedules.add(createSchedule("Базы данных (доп.)", "четверг", "18:00 - 21:00", "Аудитория 410", "Кузнецов А.В."));
        nextId = 5;
    }

    private Map<String, Object> createSchedule(String course, String day, String time, String room, String teacher) {
        Map<String, Object> s = new HashMap<>();
        s.put("id", nextId++);
        s.put("course", course);
        s.put("day", day);
        s.put("time", time);
        s.put("room", room);
        s.put("teacher", teacher);
        return s;
    }

    @GetMapping("/schedules")
    public List<Map<String, Object>> getAll() {
        return schedules;
    }

    @PostMapping("/schedules")
    public Map<String, Object> add(@RequestBody Map<String, Object> newItem) {
        newItem.put("id", nextId++);
        schedules.add(newItem);
        return newItem;
    }

    @DeleteMapping("/schedules/{id}")
    public Map<String, String> delete(@PathVariable int id) {
        schedules.removeIf(s -> Integer.parseInt(s.get("id").toString()) == id);
        Map<String, String> res = new HashMap<>();
        res.put("message", "Запись удалена");
        return res;
    }

    @PutMapping("/schedules/{id}")
    public Map<String, Object> update(@PathVariable int id, @RequestBody Map<String, Object> updated) {
        for (Map<String, Object> s : schedules) {
            if (Integer.parseInt(s.get("id").toString()) == id) {
                s.put("course", updated.get("course"));
                s.put("day", updated.get("day"));
                s.put("time", updated.get("time"));
                s.put("room", updated.get("room"));
                s.put("teacher", updated.get("teacher"));
                return s;
            }
        }
        return null;
    }

    // 🆕 统计今日课程数量
    @GetMapping("/schedules/today-count")
    public Map<String, Object> getTodayCount() {
        String[] days = {"воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"};
        Calendar cal = Calendar.getInstance();
        int dayOfWeek = cal.get(Calendar.DAY_OF_WEEK); // 1=周日, 2=周一...
        String today = days[dayOfWeek - 1];

        long count = schedules.stream()
                .filter(s -> s.get("day").equals(today))
                .count();

        Map<String, Object> result = new HashMap<>();
        result.put("today", today);
        result.put("count", count);
        return result;
    }
}