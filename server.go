package main

import (
	"bufio"
	"fmt"
	"log"
	"net/http"
	"os/exec"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		cmd := exec.Command("k6", "run", `k6-performance-test/main_test.js`)
		pipe, err := cmd.StdoutPipe()
		if err != nil {
			panic(err)
		}
		errPipe, err := cmd.StderrPipe()
		if err != nil {
			panic(err)
		}
		cmd.Start()

		colorRed := "\033[31m"
		go func() {
			scanner := bufio.NewScanner(errPipe)
			scanner.Split(bufio.ScanLines)
			for scanner.Scan() {
				m := scanner.Text()
				fmt.Println(colorRed, m)
			}
		}()

		go func() {
			scanner := bufio.NewScanner(pipe)
			scanner.Split(bufio.ScanLines)
			for scanner.Scan() {
				m := scanner.Text()
				fmt.Println(m)
			}
		}()

		cmd.Wait()
		w.Write([]byte("success"))
	})

	fmt.Printf("Starting server at port 8080\n")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}
