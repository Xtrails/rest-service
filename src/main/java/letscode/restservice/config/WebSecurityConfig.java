package letscode.restservice.config;

import letscode.restservice.domain.User;
import letscode.restservice.repo.UserDetailsRepo;
import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;
import org.springframework.boot.autoconfigure.security.oauth2.resource.PrincipalExtractor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

import java.time.LocalDateTime;

@Configuration
@EnableWebSecurity
@EnableOAuth2Sso
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .antMatcher("/**")
                .authorizeRequests()
                .antMatchers("/","/login**","/js/**","/error**", "/templates/css/**","/css/**").permitAll()
                .anyRequest().authenticated()
                .and().logout().logoutSuccessUrl("/").permitAll()
                .and()
                .csrf().disable();
    }

    @Bean
    public PrincipalExtractor principalExtractor(UserDetailsRepo userDetailsRepo){
        return map -> {
            String id = (String) map.get("sub");
            //Ищем пользователя в бд
            User user = userDetailsRepo.findById(id).orElseGet(()->{
                //Если не находим пользователя в бд, создаем нового
                User newuser = new User();

                newuser.setId(id);
                newuser.setName((String) map.get("name"));
                newuser.setEmail((String) map.get("email"));
                newuser.setGender((String) map.get("gender"));
                newuser.setLocale((String) map.get("locale"));
                newuser.setUserpic((String) map.get("picture"));

                return newuser;
            });

            user.setLastVisit(LocalDateTime.now());

            return userDetailsRepo.save(user);
        };
    }
}
