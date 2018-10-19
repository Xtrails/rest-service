package letscode.restservice.repo;

import letscode.restservice.domain.Message;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepo extends JpaRepository<Message, Long> {}
