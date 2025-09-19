function ErrorText({styleClass, children}){
    return(
        <p className={`text-center  text-red-500 ${styleClass}`}>{children}</p>
    )
}

export default ErrorText