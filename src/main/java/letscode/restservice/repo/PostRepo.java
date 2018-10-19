package letscode.restservice.repo;

import letscode.restservice.domain.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepo extends JpaRepository<Post,Long> {}
