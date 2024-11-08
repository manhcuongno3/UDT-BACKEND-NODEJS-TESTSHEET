import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, BindingScope} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';
import { AuthService } from './services';
import { MyTokenService } from './services/token.service';
import { TokenServiceBindings } from '@loopback/authentication-jwt';
import {AuthenticationComponent, registerAuthenticationStrategy} from '@loopback/authentication';
import {JWTAuthenticationStrategy} from './middlewares/auth.middleware';

export {ApplicationConfig};

export class EcommerceApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });

    // Add this configuration before component(RestExplorerComponent)
    this.api({
      openapi: '3.0.0',
      info: {
        title: 'Ecommerce API',
        version: '1.0.0',
      },
      paths: {},
      components: {
        securitySchemes: {
          jwt: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [{jwt: []}],
    });

    this.component(RestExplorerComponent);

    this.bind('services.AuthService').toClass(AuthService);
    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(MyTokenService)

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    // Add authentication
    this.component(AuthenticationComponent);
    registerAuthenticationStrategy(this, JWTAuthenticationStrategy);

    this.bind('jwt.secret').to(process.env.JWT_SECRET || 'your-secret-key');
  }
}
