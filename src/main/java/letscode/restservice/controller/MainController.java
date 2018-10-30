package letscode.restservice.controller;

import letscode.restservice.domain.User;
import letscode.restservice.repo.PostRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.HashMap;

@Controller
@RequestMapping("/")
public class MainController {
    private final PostRepo postRepo;

    @Autowired
    public MainController(PostRepo postRepo) {
        this.postRepo = postRepo;
    }

    @GetMapping
    public String main(Model model, @AuthenticationPrincipal User user){
        HashMap<Object, Object> data = new HashMap<>();
        data.put("profile",user);
        data.put("posts",postRepo.findAll());
        model.addAttribute("frontendData", data);
        return "index";
    }
}
