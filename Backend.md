Sub AddSingleQuotesToAllCells()
    Dim cell As Range
    For Each cell In Selection
        If Not IsEmpty(cell.Value) Then
            cell.Value = "'" & cell.Value & "'"
        End If
    Next cell
End Sub
