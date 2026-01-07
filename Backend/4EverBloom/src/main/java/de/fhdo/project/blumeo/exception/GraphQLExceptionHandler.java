package de.fhdo.project.blumeo.exception;

import graphql.GraphQLError;
import graphql.GraphqlErrorBuilder;
import graphql.schema.DataFetchingEnvironment;
import org.springframework.graphql.execution.DataFetcherExceptionResolverAdapter;
import org.springframework.stereotype.Component;

@Component
public class GraphQLExceptionHandler extends DataFetcherExceptionResolverAdapter {

    @Override
    protected GraphQLError resolveToSingleError(
            Throwable ex,
            DataFetchingEnvironment env
    ) {

        if (ex instanceof EmailAlreadyExistsException) {
            return GraphqlErrorBuilder.newError(env)
                    .message(ex.getMessage())
                    .errorType(graphql.ErrorType.ValidationError)
                    .build();
        }

        return GraphqlErrorBuilder.newError(env)
                .message("Internal server error")
                .errorType(graphql.ErrorType.DataFetchingException)
                .build();
    }
}
