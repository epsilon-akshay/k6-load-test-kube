package main

import (
	"bufio"
	"fmt"
	"log"
	"net/http"
	"os/exec"
	"strings"
)

func loadTest(w http.ResponseWriter, r *http.Request) {
	defer func() {
		fmt.Println("test ended")
	}()
	serviceName := strings.ToLower(r.URL.Query().Get("serviceName"))
	scenario := strings.ToLower(r.URL.Query().Get("scenario"))
	fmt.Printf("Test %s of service for scenario is %s is start...\n", serviceName, scenario)

	testTargetK6 := fmt.Sprintf("k6-performance-test/testsuite.js", serviceName)
	testTypeK6 := fmt.Sprintf("scenario=%s", scenario)

	cmd := exec.Command("./k6", "run", testTargetK6, "-e", testTypeK6)

	pipe, err := cmd.StdoutPipe()
	if err != nil {
		http.Error(w, "Error running K6 test: "+err.Error(), http.StatusInternalServerError)
		fmt.Errorf("Error running K6 test %v", err.Error())
		return
	}
	errPipe, err := cmd.StderrPipe()
	if err != nil {
		http.Error(w, "Error running K6 test: "+err.Error(), http.StatusInternalServerError)
		fmt.Errorf("Error running K6 test %v", err.Error())
		return
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
	w.WriteHeader(200)
	w.Header().Set("Content-Type", "text/plain")
	w.Write([]byte("load test ended"))
}

func main() {
	http.HandleFunc("/load-test", loadTest)

	port := 8080
	fmt.Printf("Server listening on port %d...\n", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), nil))
}
