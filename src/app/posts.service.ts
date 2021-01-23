import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from './post.model';
import { catchError, map, tap } from 'rxjs/operators'
import { Subject, throwError } from "rxjs";

@Injectable({providedIn: 'root'})
export class PostsService {
   error = new Subject<string>();
    
    
    constructor(private http: HttpClient) {
        
    }
    
    createAndStorePost(title: string, content: string){
    const postData: Post = {title: title, content:content}     
    console.log(postData);
    this.http
    .post<{name: string}>('https://angularhttp-8bd59-default-rtdb.firebaseio.com/posts.json', postData, {
      observe: 'response'
    })
    .subscribe(
      (responseData) => {
        console.log(responseData.body);       
      }, error => {
        this.error.next(error.message)
      }
      
    )
    }
    fetchPosts(){
      let searchParams = new HttpParams();
      searchParams = searchParams.append('print', 'pretty')
      searchParams = searchParams.append('custom', 'key')
       return this.http
        .get<{[key: string]: Post}>('https://angularhttp-8bd59-default-rtdb.firebaseio.com/posts.json', {
          headers: new HttpHeaders({'Custom-Header': 'Hello'}),
          params: searchParams
        })
        .pipe(map(responseData => {
          const postsArray: Post[] = [];
          for(const key in responseData){
            if(responseData.hasOwnProperty(key)) { 
              postsArray.push({ ...responseData[key], id: key })
            }
          } 
          return postsArray
        }),
          catchError(errorRes => {
            return throwError(errorRes)
          })  
        )
    } 
    clearPost() {
      return this.http.delete('https://angularhttp-8bd59-default-rtdb.firebaseio.com/posts.json', {
        observe: 'events'
      })
      .pipe(tap(event => {
        console.log(event);
        if(event.type === HttpEventType.Sent) {
          console.log(event.type);
          
        }
        if(event.type === HttpEventType.Response) {
          console.log(event.body);
          
        }
      }))
    }
}