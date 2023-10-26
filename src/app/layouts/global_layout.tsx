// @ts-nocheck
"use client";
import React from "react";
import { ApolloProvider} from "@apollo/client";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import { SnackbarProvider, } from 'notistack';
import Nav from "../components/nav/nav";
import {isRouteProtected} from "@/utils/routesProvider";
import { usePathname } from "next/navigation";
import NoLayout from "./NoLayout";
import client from "../apolloClient";

// import dynamic from 'next/dynamic';

// const PwaUpdater = dynamic(() => import(`./PwaUpdater`), { ssr: false });




if (process.env.ENV === "DEV") {
    // Adds messages only in a dev environment
    loadDevMessages();
    loadErrorMessages();
}


const GlobalLayout = ({ children }: { children: React.ReactNode }) => {
    const path=usePathname()

    // TODO: Need to change the routes logic to protect the routes

    if(!isRouteProtected(path)){
        return(
            <NoLayout>
                <SnackbarProvider />
                <ApolloProvider client={client}>
                {children}
                </ApolloProvider>
            </NoLayout>
        )
    }

    return (
        <>  <SnackbarProvider />
            <ApolloProvider client={client}>
                <Nav />
                {children}
            </ApolloProvider>
        </>
    );
};

export default GlobalLayout;
